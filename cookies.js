// Cookie Consent Management with GoatCounter Integration
(function() {
    'use strict';

    const COOKIE_CONSENT_KEY = 'cookieConsent';
    const COOKIE_SETTINGS_KEY = 'cookieSettings';
    
    // Default settings
    const defaultSettings = {
        necessary: true,      // Always active
        analytics: false,     // GoatCounter
        marketing: false      // Future marketing cookies
    };

    // Initialize cookie banner
    function initCookieBanner() {
        const consent = getConsent();
        
        // Only show banner if no consent has been given yet
        if (consent === null) {
            showBanner();
        } else {
            // Load analytics if accepted
            const settings = getSettings();
            if (settings.analytics) {
                loadAnalytics();
            }
        }
        
        // Initialize floating download button
        initFloatingButton();
    }

    // Get consent status
    function getConsent() {
        try {
            return localStorage.getItem(COOKIE_CONSENT_KEY);
        } catch (e) {
            console.error('localStorage access failed:', e);
            return null;
        }
    }

    // Get cookie settings
    function getSettings() {
        try {
            const saved = localStorage.getItem(COOKIE_SETTINGS_KEY);
            return saved ? JSON.parse(saved) : defaultSettings;
        } catch (e) {
            console.error('Failed to load settings:', e);
            return defaultSettings;
        }
    }

    // Save cookie settings
    function saveSettings(settings) {
        try {
            localStorage.setItem(COOKIE_SETTINGS_KEY, JSON.stringify(settings));
        } catch (e) {
            console.error('Failed to save settings:', e);
        }
    }

    // Show banner
    function showBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.style.display = 'block';
        }
    }

    // Hide banner
    function hideBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.style.display = 'none';
        }
    }

    // Accept all cookies
    window.acceptCookies = function() {
        const settings = {
            necessary: true,
            analytics: true,
            marketing: false
        };
        
        try {
            localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
            saveSettings(settings);
            hideBanner();
            loadAnalytics();
        } catch (e) {
            console.error('Failed to accept cookies:', e);
        }
    };

    // Essential cookies only
    window.declineCookies = function() {
        const settings = {
            necessary: true,
            analytics: false,
            marketing: false
        };
        
        try {
            localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
            saveSettings(settings);
            hideBanner();
        } catch (e) {
            console.error('Failed to decline cookies:', e);
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
        const analyticsToggle = document.getElementById('cookie-analytics');
        const marketingToggle = document.getElementById('cookie-marketing');
        
        const settings = {
            necessary: true,
            analytics: analyticsToggle ? analyticsToggle.checked : false,
            marketing: marketingToggle ? marketingToggle.checked : false
        };
        
        saveSettings(settings);
        
        try {
            localStorage.setItem(COOKIE_CONSENT_KEY, 'custom');
        } catch (e) {
            console.error('Failed to save consent:', e);
        }
        
        closeCookieSettings();
        hideBanner();
        
        // Enable/disable analytics
        if (settings.analytics) {
            loadAnalytics();
        } else {
            removeAnalytics();
        }
    };

    // Load GoatCounter Analytics
    function loadAnalytics() {
        const settings = getSettings();
        
        if (!settings.analytics) {
            return;
        }
        
        // Check if GoatCounter is already loaded
        if (window.goatcounter || document.querySelector('script[data-goatcounter]')) {
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
        // Remove GoatCounter script if present
        const scripts = document.querySelectorAll('script[data-goatcounter]');
        scripts.forEach(script => script.remove());
        
        // Remove GoatCounter object
        if (window.goatcounter) {
            delete window.goatcounter;
        }
        
        console.log('GoatCounter Analytics removed');
    }

    // Initialize Floating Download Button
    function initFloatingButton() {
        // Check if button already exists
        if (document.getElementById('floating-download-btn')) {
            return;
        }
        
        // Create floating button
        const button = document.createElement('a');
        button.id = 'floating-download-btn';
        button.href = 'download.html';
        button.innerHTML = '📚 Resources & Downloads';
        
        // Add styles
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #2f6f8f 0%, #5fa8c9 100%);
            color: #ffffff;
            padding: 1rem 1.5rem;
            border-radius: 50px;
            font-weight: bold;
            font-size: 0.95rem;
            text-decoration: none;
            box-shadow: 0 4px 15px rgba(47, 111, 143, 0.4);
            z-index: 999;
            transition: all 0.3s ease;
            font-family: Arial, Helvetica, sans-serif;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            animation: float-in 0.5s ease-out;
        `;
        
        // Add hover effect
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 6px 20px rgba(47, 111, 143, 0.5)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 15px rgba(47, 111, 143, 0.4)';
        });
        
        // Add animation keyframes
        if (!document.getElementById('floating-btn-styles')) {
            const style = document.createElement('style');
            style.id = 'floating-btn-styles';
            style.textContent = `
                @keyframes float-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @media (max-width: 768px) {
                    #floating-download-btn {
                        bottom: 15px !important;
                        right: 15px !important;
                        padding: 0.8rem 1.2rem !important;
                        font-size: 0.85rem !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Append to body
        document.body.appendChild(button);
    }

    // Reset consent (for development/testing)
    window.resetCookieConsent = function() {
        try {
            localStorage.removeItem(COOKIE_CONSENT_KEY);
            localStorage.removeItem(COOKIE_SETTINGS_KEY);
            location.reload();
        } catch (e) {
            console.error('Failed to reset consent:', e);
        }
    };

    // Initialize on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCookieBanner);
    } else {
        initCookieBanner();
    }

})();

// Helper function: Manual event tracking with GoatCounter
window.trackEvent = function(eventName, eventData = {}) {
    try {
        const settings = JSON.parse(localStorage.getItem('cookieSettings') || '{}');
        
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
