/**
 * ShoreSquad - JavaScript Application
 * 
 * Features:
 * - Performance optimization with debouncing and lazy loading
 * - Interactive UI elements and animations
 * - Local storage for user data
 * - Accessibility enhancements
 * - Service Worker support for offline capability
 */

// ==========================================
// PERFORMANCE UTILITIES
// ==========================================

/**
 * Debounce function to limit execution frequency
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, delay = 300) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * Throttle function to limit execution frequency
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit = 300) {
    let lastFunc;
    let lastRan;
    return function (...args) {
        if (!lastRan) {
            func.apply(this, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(
                () => {
                    if (Date.now() - lastRan >= limit) {
                        func.apply(this, args);
                        lastRan = Date.now();
                    }
                },
                limit - (Date.now() - lastRan)
            );
        }
    };
}

// ==========================================
// LOCAL STORAGE MANAGEMENT
// ==========================================

/**
 * Local storage wrapper for crew data
 */
const CrewStorage = {
    /**
     * Get crew data from local storage
     * @returns {Object} Crew data
     */
    getCrew() {
        const data = localStorage.getItem('shoresquad_crew');
        return data ? JSON.parse(data) : { members: 0, cleanups: 0, lbsRemoved: 0 };
    },

    /**
     * Save crew data to local storage
     * @param {Object} crewData - Crew data to save
     */
    saveCrew(crewData) {
        localStorage.setItem('shoresquad_crew', JSON.stringify(crewData));
        updateStats();
    },

    /**
     * Add member to crew
     */
    addMember() {
        const crew = this.getCrew();
        crew.members++;
        this.saveCrew(crew);
    },

    /**
     * Record a cleanup event
     * @param {number} pounds - Pounds of trash removed
     */
    recordCleanup(pounds = 10) {
        const crew = this.getCrew();
        crew.cleanups++;
        crew.lbsRemoved += pounds;
        this.saveCrew(crew);
    }
};

// ==========================================
// UI INTERACTIVITY
// ==========================================

/**
 * Initialize navigation toggle for mobile
 */
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Close menu on link click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('active');
            }
        });
    }
}

/**
 * Add click animation to feature cards
 */
function initFeatureCards() {
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('click', function() {
            // Visual feedback animation
            this.style.animation = 'pulse 0.5s ease-in-out';
            setTimeout(() => {
                this.style.animation = 'none';
            }, 500);
        });

        // Keyboard accessibility
        card.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                this.click();
            }
        });
    });
}

/**
 * Initialize buttons
 */
function initButtons() {
    const getStartedBtn = document.getElementById('get-started-btn');
    const joinBtn = document.getElementById('join-btn');

    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => {
            showNotification('Welcome to ShoreSquad! 🌊 Get ready to make waves!');
            CrewStorage.addMember();
        });
    }

    if (joinBtn) {
        joinBtn.addEventListener('click', () => {
            showNotification('Thanks for joining! Check your inbox for next steps.');
            CrewStorage.addMember();
        });
    }
}

/**
 * Display notification to user
 * @param {string} message - Notification message
 */
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #2D6A4F;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1001;
        animation: slideIn 0.3s ease-in-out;
    `;
    notification.textContent = message;
    notification.setAttribute('role', 'status');
    notification.setAttribute('aria-live', 'polite');

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ==========================================
// STATISTICS UPDATES
// ==========================================

/**
 * Update statistics display
 */
function updateStats() {
    const crew = CrewStorage.getCrew();
    const statNumbers = document.querySelectorAll('.stat-number');

    if (statNumbers[0]) statNumbers[0].textContent = crew.cleanups;
    if (statNumbers[1]) statNumbers[1].textContent = crew.members;
    if (statNumbers[2]) statNumbers[2].textContent = crew.lbsRemoved;
}

// ==========================================
// LAZY LOADING
// ==========================================

/**
 * Initialize lazy loading for images
 */
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ==========================================
// ANIMATIONS
// ==========================================

/**
 * Add animation keyframes to document
 */
function addAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }

        img.loaded {
            animation: fadeIn 0.5s ease-in-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// ==========================================
// WINDOW RESIZE HANDLER (Debounced)
// ==========================================

const handleResize = debounce(() => {
    console.log('Window resized:', window.innerWidth);
}, 300);

window.addEventListener('resize', handleResize);

// ==========================================
// INITIALIZATION
// ==========================================

/**
 * Initialize all application features
 */
function initApp() {
    console.log('🌊 ShoreSquad App Initializing...');

    addAnimations();
    initNavigation();
    initFeatureCards();
    initButtons();
    initLazyLoading();
    updateStats();

    // Register service worker if available
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js').catch(() => {
            console.log('Service Worker not available');
        });
    }

    console.log('✅ ShoreSquad App Ready!');
}

// Initialize on DOM content loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// ==========================================
// EXPORT FOR MODULE USAGE
// ==========================================

export { debounce, throttle, CrewStorage, showNotification };
