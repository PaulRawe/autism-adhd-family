/**
 * Automatic Disclaimer Injection
 * Injects legal disclaimers at the top of pages based on content type
 * Usage: <script src="disclaimer.js" defer></script>
 */

(function() {
    'use strict';
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        const path = window.location.pathname.toLowerCase();
        
        // Determine what type of disclaimer to show
        if (shouldShowMedicalDisclaimer(path)) {
            injectMedicalDisclaimer();
        } else if (shouldShowGeneralDisclaimer(path)) {
            injectGeneralDisclaimer();
        }
    }
    
    function shouldShowMedicalDisclaimer(path) {
        // Check if we're on the homepage
        const pathParts = path.split('/').filter(p => p.length > 0);
        const lastPart = pathParts[pathParts.length - 1] || '';
        
        // Homepage detection: 
        // - Empty path or just one folder name (GitHub Pages project folder)
        // - Ends with index.html
        // - Ends with just a slash
        const isHomepage = pathParts.length <= 1 || 
                          lastPart === 'index.html' ||
                          path.endsWith('/') && pathParts.length <= 2;
        
        // Show on index, parents, hobbies, daily, school, social pages
        return isHomepage ||
               path.includes('/parents/') || 
               path.includes('/hobbies/') ||
               path.includes('/daily/') ||
               path.includes('/school/') ||
               path.includes('/social/');
    }
    
    function shouldShowGeneralDisclaimer(path) {
        // Show general disclaimer on legal pages
        return path.includes('privacy') ||
               path.includes('terms') ||
               path.includes('transparency');
    }
    
    function injectMedicalDisclaimer() {
        const disclaimer = createDisclaimerElement(
            '⚠️ Important Medical & Legal Disclaimer',
            'This website shares personal experiences and is <strong>NOT medical, therapeutic, or educational advice</strong>. Every child is unique. What works for our family may not work for yours. <strong>Always consult qualified healthcare providers, therapists, and educators</strong> for your child\'s individual needs. We assume no liability for decisions made based on this content.',
            'medical'
        );
        
        insertDisclaimer(disclaimer);
    }
    
    function injectGeneralDisclaimer() {
        const disclaimer = createDisclaimerElement(
            'ℹ️ Information Notice',
            'This website is for informational purposes only. Content may change without notice. We make reasonable efforts to ensure accuracy but cannot guarantee completeness or timeliness.',
            'info'
        );
        
        insertDisclaimer(disclaimer);
    }
    
    function createDisclaimerElement(title, text, type) {
        const div = document.createElement('div');
        div.className = 'auto-disclaimer auto-disclaimer-' + type;
        div.setAttribute('role', 'alert');
        div.setAttribute('aria-live', 'polite');
        
        div.innerHTML = `
            <div class="auto-disclaimer-content">
                <h3 class="auto-disclaimer-title">${title}</h3>
                <p class="auto-disclaimer-text">${text}</p>
            </div>
        `;
        
        return div;
    }
    
    function insertDisclaimer(element) {
        // Find the main content area or header
        const main = document.querySelector('main');
        const header = document.querySelector('header');
        const body = document.body;
        
        if (main) {
            // Insert at the beginning of main
            main.insertBefore(element, main.firstChild);
        } else if (header && header.nextSibling) {
            // Insert after header
            header.parentNode.insertBefore(element, header.nextSibling);
        } else {
            // Insert at beginning of body
            body.insertBefore(element, body.firstChild);
        }
    }
    
    // Inject CSS styles
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .auto-disclaimer {
                margin: 20px auto;
                max-width: 1100px;
                padding: 0 1rem;
                animation: disclaimerSlideIn 0.3s ease-out;
            }
            
            .auto-disclaimer-content {
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            
            .auto-disclaimer-medical .auto-disclaimer-content {
                background: #fee;
                border: 3px solid #dc2626;
                border-left: 6px solid #dc2626;
            }
            
            .auto-disclaimer-info .auto-disclaimer-content {
                background: #eff6ff;
                border: 2px solid #2563eb;
                border-left: 5px solid #2563eb;
            }
            
            .auto-disclaimer-title {
                margin: 0 0 10px 0;
                font-size: 1.1em;
                font-weight: 700;
                color: #1f2937;
            }
            
            .auto-disclaimer-medical .auto-disclaimer-title {
                color: #dc2626;
            }
            
            .auto-disclaimer-info .auto-disclaimer-title {
                color: #2563eb;
            }
            
            .auto-disclaimer-text {
                margin: 0;
                font-size: 0.95em;
                line-height: 1.6;
                color: #374151;
            }
            
            .auto-disclaimer-text strong {
                color: #1f2937;
                font-weight: 600;
            }
            
            @keyframes disclaimerSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @media (max-width: 768px) {
                .auto-disclaimer {
                    margin: 15px auto;
                }
                
                .auto-disclaimer-content {
                    padding: 15px;
                }
                
                .auto-disclaimer-title {
                    font-size: 1em;
                }
                
                .auto-disclaimer-text {
                    font-size: 0.9em;
                }
            }
            
            /* Ensure disclaimer appears above content */
            main > .auto-disclaimer:first-child {
                margin-bottom: 2rem;
            }
        `;
        
        document.head.appendChild(style);
    }
    
    // Inject styles immediately
    injectStyles();
})();
