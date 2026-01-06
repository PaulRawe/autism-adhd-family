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
        
        if (consent === null) {
            showBanner();
        } else if (consent === 'accepted') {
            loadAnalytics();
        }
    }

    // Get consent status
    function getConsent() {
        return localStorage.getItem(COOKIE_CONSENT_KEY);
    }

    // Get cookie settings
    function getSettings() {
        const saved = localStorage.getItem(COOKIE_SETTINGS_KEY);
        return saved ? JSON.parse(saved) : defaultSettings;
    }

    // Save cookie settings
    function saveSettings(settings) {
        localStorage.setItem(COOKIE_SETTINGS_KEY, JSON.stringify(settings));
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
        
        localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
        saveSettings(settings);
        hideBanner();
        loadAnalytics();
    };

    // Essential cookies only
    window.declineCookies = function() {
        const settings = {
            necessary: true,
            analytics: false,
            marketing: false
        };
        
        localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
        saveSettings(settings);
        hideBanner();
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
        localStorage.setItem(COOKIE_CONSENT_KEY, 'custom');
        
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
        if (window.goatcounter) {
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

    // Reset consent (for development/testing)
    window.resetCookieConsent = function() {
        localStorage.removeItem(COOKIE_CONSENT_KEY);
        localStorage.removeItem(COOKIE_SETTINGS_KEY);
        location.reload();
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
};
