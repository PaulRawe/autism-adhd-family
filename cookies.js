// Cookie Consent Management with GoatCounter Integration
(function() {
    'use strict';

    const COOKIE_CONSENT_KEY = 'cookieConsent';
    const COOKIE_SETTINGS_KEY = 'cookieSettings';
    const COOKIE_EXPIRY_DAYS = 365;
    
    // Default settings
    const defaultSettings = {
        necessary: true,      // Always active
        analytics: false,     // GoatCounter
        marketing: false      // Future marketing cookies
    };

    // Check if localStorage is available
    function isLocalStorageAvailable() {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    // Fallback to cookies if localStorage is not available
    const useLocalStorage = isLocalStorageAvailable();

    // Cookie helper functions
    function setCookie(name, value, days) {
        try {
            const expires = new Date();
            expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
            const cookieString = name + '=' + encodeURIComponent(value) + ';expires=' + expires.toUTCString() + ';path=/;SameSite=Lax';
            document.cookie = cookieString;
            console.log('Cookie set:', name, '=', value);
            console.log('Cookie string:', cookieString);
            return true;
        } catch (e) {
            console.error('Failed to set cookie:', e);
            return false;
        }
    }

    function getCookie(name) {
        try {
            const nameEQ = name + '=';
            const ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) {
                    const value = decodeURIComponent(c.substring(nameEQ.length, c.length));
                    console.log('Cookie retrieved:', name, '=', value);
                    return value;
                }
            }
            console.log('Cookie not found:', name);
            return null;
        } catch (e) {
            console.error('Failed to get cookie:', e);
            return null;
        }
    }

    function deleteCookie(name) {
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;SameSite=Lax';
    }

    // Storage abstraction layer - Uses cookies as primary method
    function getItem(key) {
        // Always try cookie first
        const cookieValue = getCookie(key);
        if (cookieValue) {
            return cookieValue;
        }
        
        // Fallback to localStorage if available
        if (useLocalStorage) {
            try {
                const lsValue = localStorage.getItem(key);
                if (lsValue) {
                    console.log('Found in localStorage, migrating to cookie:', key);
                    setCookie(key, lsValue, COOKIE_EXPIRY_DAYS);
                    return lsValue;
                }
            } catch (e) {
                console.warn('localStorage read failed:', e);
            }
        }
        
        return null;
    }

    function setItem(key, value) {
        // Always set cookie first (primary storage)
        const cookieSet = setCookie(key, value, COOKIE_EXPIRY_DAYS);
        
        // Also try localStorage as backup
        if (useLocalStorage) {
            try {
                localStorage.setItem(key, value);
                console.log('Also stored in localStorage:', key);
            } catch (e) {
                console.warn('localStorage write failed (not critical):', e);
            }
        }
        
        return cookieSet;
    }

    function removeItem(key) {
        if (useLocalStorage) {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                console.warn('localStorage delete failed:', e);
            }
        }
        deleteCookie(key);
    }

    // Initialize cookie banner
    function initCookieBanner() {
        console.log('=== Initializing Cookie Banner ===');
        console.log('Current URL:', window.location.href);
        console.log('All cookies:', document.cookie);
        
        const consent = getConsent();
        console.log('Consent status retrieved:', consent, '(type:', typeof consent, ')');
        
        const settings = getSettings();
        console.log('Current settings:', settings);
        
        // Valid consent values
        const validConsent = ['accepted', 'declined', 'custom'];
        const hasValidConsent = consent && validConsent.includes(consent);
        
        console.log('Has valid consent:', hasValidConsent);
        
        if (!hasValidConsent) {
            console.log('>>> Showing banner (no valid consent found)');
            showBanner();
        } else {
            console.log('>>> Not showing banner (valid consent exists:', consent, ')');
            // Load analytics if accepted
            if (settings.analytics) {
                console.log('Loading analytics (user accepted)');
                loadAnalytics();
            }
        }
        
        // Initialize floating download button
        initFloatingButton();
        
        console.log('=== Cookie Banner Initialization Complete ===');
    }

    // Get consent status
    function getConsent() {
        const consent = getItem(COOKIE_CONSENT_KEY);
        // Ensure we return null for empty/undefined values
        if (!consent || consent === 'null' || consent === 'undefined') {
            return null;
        }
        return consent;
    }

    // Get cookie settings
    function getSettings() {
        try {
            const saved = getItem(COOKIE_SETTINGS_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                console.log('Retrieved settings:', parsed);
                return parsed;
            }
            return defaultSettings;
        } catch (e) {
            console.error('Failed to load settings:', e);
            return defaultSettings;
        }
    }

    // Save cookie settings
    function saveSettings(settings) {
        try {
            const settingsJson = JSON.stringify(settings);
            const saved = setItem(COOKIE_SETTINGS_KEY, settingsJson);
            console.log('Settings save result:', saved);
            console.log('Settings JSON:', settingsJson);
            return saved;
        } catch (e) {
            console.error('Failed to save settings:', e);
            return false;
        }
    }

    // Show banner
    function showBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.style.display = 'block';
            console.log('Banner shown');
        } else {
            console.warn('Cookie banner element not found');
        }
    }

    // Hide banner
    function hideBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.style.display = 'none';
            console.log('Banner hidden');
        }
    }

    // Accept all cookies
    window.acceptCookies = function() {
        console.log('=== ACCEPT COOKIES CLICKED ===');
        
        const settings = {
            necessary: true,
            analytics: true,
            marketing: false
        };
        
        try {
            // Save consent
            const consentSaved = setItem(COOKIE_CONSENT_KEY, 'accepted');
            console.log('Consent save result:', consentSaved);
            
            // Save settings
            saveSettings(settings);
            
            // Hide banner immediately
            hideBanner();
            
            // Load analytics
            loadAnalytics();
            
            // Verify immediately
            setTimeout(function() {
                const verifyConsent = getItem(COOKIE_CONSENT_KEY);
                const verifySettings = getItem(COOKIE_SETTINGS_KEY);
                console.log('=== VERIFICATION ===');
                console.log('Consent saved as:', verifyConsent);
                console.log('Settings saved as:', verifySettings);
                console.log('All cookies now:', document.cookie);
                console.log('===================');
                
                if (verifyConsent !== 'accepted') {
                    console.error('ERROR: Consent not properly saved!');
                    alert('Cookie consent could not be saved. Please check your browser settings.');
                }
            }, 100);
            
        } catch (e) {
            console.error('Failed to accept cookies:', e);
            alert('An error occurred while saving your cookie preferences.');
        }
    };

    // Essential cookies only
    window.declineCookies = function() {
        console.log('=== DECLINE COOKIES CLICKED ===');
        
        const settings = {
            necessary: true,
            analytics: false,
            marketing: false
        };
        
        try {
            // Save consent
            const consentSaved = setItem(COOKIE_CONSENT_KEY, 'declined');
            console.log('Consent save result:', consentSaved);
            
            // Save settings
            saveSettings(settings);
            
            // Hide banner immediately
            hideBanner();
            
            // Verify immediately
            setTimeout(function() {
                const verifyConsent = getItem(COOKIE_CONSENT_KEY);
                const verifySettings = getItem(COOKIE_SETTINGS_KEY);
                console.log('=== VERIFICATION ===');
                console.log('Consent saved as:', verifyConsent);
                console.log('Settings saved as:', verifySettings);
                console.log('All cookies now:', document.cookie);
                console.log('===================');
                
                if (verifyConsent !== 'declined') {
                    console.error('ERROR: Consent not properly saved!');
                    alert('Cookie consent could not be saved. Please check your browser settings.');
                }
            }, 100);
            
        } catch (e) {
            console.error('Failed to decline cookies:', e);
            alert('An error occurred while saving your cookie preferences.');
        }
    };

    // Open settings
    window.openCookieSettings = function() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.classList.add('active');
            loadCurrentSettings();
        }
    };

    // Close settings
    window.closeCookieSettings = function() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    };

    // Load current settings into modal
    function loadCurrentSettings() {
        const settings = getSettings();
        
        const analyticsToggle = document.getElementById('cookie-analytics');
        const marketingToggle = document.getElementById('cookie-marketing');
        
        if (analyticsToggle) analyticsToggle.checked = settings.analytics;
        if (marketingToggle) marketingToggle.checked = settings.marketing;
    }

    // Save settings
    window.saveCookieSettings = function() {
        console.log('=== SAVE CUSTOM SETTINGS CLICKED ===');
        
        const analyticsToggle = document.getElementById('cookie-analytics');
        const marketingToggle = document.getElementById('cookie-marketing');
        
        const settings = {
            necessary: true,
            analytics: analyticsToggle ? analyticsToggle.checked : false,
            marketing: marketingToggle ? marketingToggle.checked : false
        };
        
        console.log('Custom settings:', settings);
        
        try {
            // Save settings
            saveSettings(settings);
            
            // Save consent
            const consentSaved = setItem(COOKIE_CONSENT_KEY, 'custom');
            console.log('Consent save result:', consentSaved);
            
            // Close modal
            closeCookieSettings();
            
            // Hide banner
            hideBanner();
            
            // Enable/disable analytics
            if (settings.analytics) {
                loadAnalytics();
            } else {
                removeAnalytics();
            }
            
            // Verify immediately
            setTimeout(function() {
                const verifyConsent = getItem(COOKIE_CONSENT_KEY);
                const verifySettings = getItem(COOKIE_SETTINGS_KEY);
                console.log('=== VERIFICATION ===');
                console.log('Consent saved as:', verifyConsent);
                console.log('Settings saved as:', verifySettings);
                console.log('All cookies now:', document.cookie);
                console.log('===================');
                
                if (verifyConsent !== 'custom') {
                    console.error('ERROR: Consent not properly saved!');
                    alert('Cookie consent could not be saved. Please check your browser settings.');
                }
            }, 100);
            
        } catch (e) {
            console.error('Failed to save custom settings:', e);
            alert('An error occurred while saving your cookie preferences.');
        }
    };

    // Load GoatCounter Analytics
    function loadAnalytics() {
        const settings = getSettings();
        
        if (!settings.analytics) {
            console.log('Analytics disabled in settings');
            return;
        }
        
        // Check if GoatCounter is already loaded
        if (window.goatcounter || document.querySelector('script[data-goatcounter]')) {
            console.log('GoatCounter already loaded');
            return;
        }
        
        // Load GoatCounter script
        const script = document.createElement('script');
        script.async = true;
        script.src = '//gc.zgo.at/count.js';
        script.setAttribute('data-goatcounter', 'https://pauleheissta.goatcounter.com/count');
        
        document.head.appendChild(script);
        
        console.log('GoatCounter Analytics loaded');
    }

    // Remove analytics
    function removeAnalytics() {
        const scripts = document.querySelectorAll('script[data-goatcounter]');
        scripts.forEach(script => script.remove());
        
        if (window.goatcounter) {
            delete window.goatcounter;
        }
        
        console.log('GoatCounter Analytics removed');
    }

    // ==================================================
    // STICKY DOWNLOAD BUTTON - DUAL VERSION
    // ==================================================
    function initFloatingButton() {
        if (document.getElementById('sticky-download-button')) return;

        const depth = (window.location.pathname.match(/\//g) || []).length - 1;
        const pathToDownloads = depth > 0 ? '../'.repeat(depth) + 'download.html' : 'download.html';

        const buttonHTML = `
        <div id="sticky-download-button">
            <a href="${pathToDownloads}" class="sticky-btn primary" aria-label="Resources & Downloads">
                <span class="sticky-btn-icon">📚</span>
                <span class="sticky-btn-text">
                    <strong>Downloads</strong>
                    <small>All Resources</small>
                </span>
            </a>
            <a href="https://www.etsy.com/shop/NeuroTeacherTools"
               class="sticky-btn etsy"
               target="_blank"
               rel="noopener"
               aria-label="Shop on Etsy">
                <span class="sticky-btn-icon">🛍️</span>
                <span class="sticky-btn-text">
                    <strong>Etsy Shop</strong>
                    <small>Buy Securely</small>
                </span>
            </a>
        </div>
        `;

        const container = document.createElement('div');
        container.innerHTML = buttonHTML.trim();
        document.body.appendChild(container.firstElementChild);

        const banner = document.getElementById('cookie-banner');
        if (banner) {
            updateBannerClass();
            new MutationObserver(updateBannerClass)
                .observe(banner, { attributes: true, attributeFilter: ['style'] });
        }

        function updateBannerClass() {
            const b = document.getElementById('cookie-banner');
            document.body.classList.toggle('cookie-banner-visible',
                b && b.style.display !== 'none');
        }
    }

    // Reset consent (for development/testing)
    window.resetCookieConsent = function() {
        console.log('Resetting cookie consent');
        try {
            removeItem(COOKIE_CONSENT_KEY);
            removeItem(COOKIE_SETTINGS_KEY);
            console.log('Consent reset, reloading page');
            location.reload();
        } catch (e) {
            console.error('Failed to reset consent:', e);
        }
    };

    // Debug function to check current state
    window.debugCookieConsent = function() {
        console.log('=== Cookie Consent Debug Info ===');
        console.log('localStorage available:', useLocalStorage);
        console.log('Consent status:', getItem(COOKIE_CONSENT_KEY));
        console.log('Settings:', getItem(COOKIE_SETTINGS_KEY));
        console.log('All cookies:', document.cookie);
        if (useLocalStorage) {
            console.log('localStorage consent:', localStorage.getItem(COOKIE_CONSENT_KEY));
            console.log('localStorage settings:', localStorage.getItem(COOKIE_SETTINGS_KEY));
        }
        console.log('================================');
    };

    // Initialize on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCookieBanner);
    } else {
        initCookieBanner();
    }

    console.log('Cookie consent script initialized');
    console.log('Using localStorage:', useLocalStorage);

})();

// ==================================================
// Helper function: Manual event tracking with GoatCounter
// ==================================================
window.trackEvent = function(eventName, eventData = {}) {
    try {
        const settings = JSON.parse(getItem('cookieSettings') || '{}');
        
        if (!settings.analytics || !window.goatcounter) {
            console.log('Analytics disabled or not loaded');
            return;
        }
        
        window.goatcounter.count({
            path: eventName,
            title: eventData.title || eventName,
            event: true
        });
    } catch (e) {
        console.error('Event tracking failed:', e);
    }
};

// Make getItem available globally for trackEvent
function getItem(key) {
    try {
        if (typeof localStorage !== 'undefined') {
            return localStorage.getItem(key);
        }
    } catch (e) {
        // Fallback to cookie
    }
    
    const nameEQ = key + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) {
            return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
    }
    return null;
}

// Hide ad containers
document.querySelectorAll('.ad-container').forEach(el => el.style.display = 'none');

// ==================================================
// FUNNEL LINK BOX – Am Anfang von <main>
// ==================================================
(function() {
    'use strict';

    function insertFunnelLink() {
        if (document.getElementById('help-box-guidance')) return;

        const main = document.querySelector('main');
        if (!main) {
            console.log('Main element not found');
            return;
        }

        const currentPath = window.location.pathname;
        const depth = (currentPath.match(/\//g) || []).length - 1;
        
        let relativePathToFinder = '';
        if (depth === 0) {
            relativePathToFinder = 'daily-help-finder/index.html';
        } else {
            relativePathToFinder = '../'.repeat(depth) + 'daily-help-finder/index.html';
        }

        const boxHTML = `
            <div id="help-box-guidance" style="
                max-width: 900px;
                margin: 0 auto 1rem auto;
                padding: 0.8rem 1rem;
                background: #f4f6f8;
                border-left: 4px solid #2f6f8f;
                border-radius: 6px;
                font-size: 0.95rem;
                line-height: 1.5;
                color: #2b2b2b;
            ">
                💡 Need guidance right now?
                <a href="${relativePathToFinder}"
                    style="color:#2f6f8f;font-weight:bold;text-decoration:underline;">
                    → Quick questions, direct help (2 min)
                </a>
            </div>
        `;

        main.insertAdjacentHTML('afterbegin', boxHTML);
        console.log('✅ Funnel link box inserted at start of main');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', insertFunnelLink);
    } else {
        insertFunnelLink();
    }
})();
// ==================================================
// FOOTER KOLLISION - Button weich nach oben schieben
// ==================================================
document.addEventListener("DOMContentLoaded", () => {
    const sticky = document.getElementById("sticky-download-button");
    const footer = document.querySelector("footer");
    if (!sticky || !footer) return;

    const margin = 8; // px Abstand

    function updatePosition() {
        const footerRect = footer.getBoundingClientRect();
        
        if (footerRect.top < window.innerHeight) {
            // Footer sichtbar → Button nach oben schieben
            const overlap = window.innerHeight - footerRect.top;
            sticky.style.bottom = (overlap + margin) + 'px';
        } else {
            // Normal → unten fixieren
            sticky.style.bottom = margin + 'px';
        }
    }

    window.addEventListener("scroll", updatePosition, { passive: true });
    window.addEventListener("resize", updatePosition, { passive: true });
    updatePosition();
});
