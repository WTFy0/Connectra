/* ================================
   CONNECTRA MAIN JAVASCRIPT
   Ultra-Interactive Features
   ================================ */

// Global State Management
const ConnectraApp = {
    isLoaded: false,
    isMobile: window.innerWidth <= 768,
    isTouch: 'ontouchstart' in window,
    scrollY: 0,
    ticking: false,
    
    // Performance tracking
    performance: {
        loadStart: performance.now(),
        loadComplete: null
    },
    
    // Element cache
    elements: {},
    
    // Animation queue
    animationQueue: [],
    
    init() {
        this.cacheElements();
        this.bindEvents();
        this.initPreloader();
        this.initNavigation();
        this.initCursor();
        this.initAnimations();
        this.initParallax();
        this.initCounters();
        this.initCarousels();
        this.initIntersectionObserver();
        this.initSmoothScroll();
        this.performance.loadComplete = performance.now();
        console.log(`Connectra loaded in ${this.performance.loadComplete - this.performance.loadStart}ms`);
    },
    
    cacheElements() {
        this.elements = {
            body: document.body,
            html: document.documentElement,
            navbar: document.getElementById('navbar'),
            hamburger: document.getElementById('hamburger'),
            mobileMenuOverlay: document.getElementById('mobile-menu-overlay'),
            mobileClose: document.getElementById('mobile-close'),
            backToTop: document.getElementById('back-to-top'),
            preloader: document.getElementById('preloader'),
            cursor: document.querySelector('.cursor'),
            cursorFollower: document.querySelector('.cursor-follower'),
            hero: document.getElementById('hero'),
            navLinks: document.querySelectorAll('.nav-link'),
            ctaButtons: document.querySelectorAll('.cta-button'),
            serviceCards: document.querySelectorAll('.service-card'),
            counters: document.querySelectorAll('[data-count]'),
            scrollIndicator: document.querySelector('.scroll-indicator'),
            mobileDropdowns: document.querySelectorAll('.mobile-dropdown')
        };
    },
    
    bindEvents() {
        // Scroll events with throttling
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
        
        // Resize events with debouncing
        window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));
        
        // Load event
        window.addEventListener('load', this.handleLoad.bind(this));
        
        // Mouse events for cursor
        if (!this.isTouch) {
            document.addEventListener('mousemove', this.handleMouseMove.bind(this));
            document.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
            document.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
        }
        
        // Click events
        document.addEventListener('click', this.handleClick.bind(this));
        
        // Keyboard events
        document.addEventListener('keydown', this.handleKeydown.bind(this));
        
        // Touch events for mobile optimization
        if (this.isTouch) {
            document.addEventListener('touchstart', this.handleTouchStart.bind(this));
            document.addEventListener('touchmove', this.handleTouchMove.bind(this));
        }
    },
    
    // Utility functions
    throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        return function (...args) {
            const currentTime = Date.now();
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    },
    
    debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    },
    
    lerp(start, end, factor) {
        return start + factor * (end - start);
    },
    
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    },
    
    easeOutBack(t) {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }
};

// Preloader
ConnectraApp.initPreloader = function() {
    const preloader = this.elements.preloader;
    if (!preloader) return;
    
    let progress = 0;
    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    
    const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        progress = Math.min(elapsed / duration, 1);
        
        // Update loading bar if exists
        const loadingLine = preloader.querySelector('.loading-line');
        if (loadingLine) {
            loadingLine.style.setProperty('--progress', `${progress * 100}%`);
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateProgress);
        } else {
            setTimeout(() => {
                preloader.classList.add('fade-out');
                setTimeout(() => {
                    preloader.remove();
                    this.elements.body.classList.add('loaded');
                    this.isLoaded = true;
                    this.initPageAnimations();
                }, 800);
            }, 300);
        }
    };
    
    requestAnimationFrame(updateProgress);
};

// Navigation
ConnectraApp.initNavigation = function() {
    const navbar = this.elements.navbar;
    const hamburger = this.elements.hamburger;
    const mobileMenuOverlay = this.elements.mobileMenuOverlay;
    const mobileClose = this.elements.mobileClose;
    const mobileDropdowns = this.elements.mobileDropdowns;
    
    if (!navbar) return;
    
    // Hamburger menu toggle
    if (hamburger && mobileMenuOverlay) {
        hamburger.addEventListener('click', (e) => {
            e.preventDefault();
            hamburger.classList.toggle('active');
            mobileMenuOverlay.classList.toggle('active');
            this.elements.body.classList.toggle('menu-open');
        });
    }
    
    // Mobile menu close
    if (mobileClose) {
        mobileClose.addEventListener('click', (e) => {
            e.preventDefault();
            hamburger?.classList.remove('active');
            mobileMenuOverlay?.classList.remove('active');
            this.elements.body.classList.remove('menu-open');
        });
    }
    
    // Mobile dropdown toggles
    mobileDropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        if (link) {
            link.addEventListener('click', (e) => {
                if (dropdown.querySelector('.mobile-submenu')) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        }
    });
    
    // Close mobile menu when clicking outside
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', (e) => {
            if (e.target === mobileMenuOverlay) {
                hamburger?.classList.remove('active');
                mobileMenuOverlay.classList.remove('active');
                this.elements.body.classList.remove('menu-open');
            }
        });
    }
    
    // Navbar scroll effect
    this.updateNavbar();
};

ConnectraApp.updateNavbar = function() {
    const navbar = this.elements.navbar;
    if (!navbar) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
};

// Custom Cursor
ConnectraApp.initCursor = function() {
    if (this.isTouch || !this.elements.cursor) return;
    
    const cursor = this.elements.cursor;
    const cursorFollower = this.elements.cursorFollower;
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;
    
    // Hide default cursor
    this.elements.body.style.cursor = 'none';
    
    // Animate cursor
    const animateCursor = () => {
        // Smooth cursor movement
        cursorX = this.lerp(cursorX, mouseX, 0.8);
        cursorY = this.lerp(cursorY, mouseY, 0.8);
        
        followerX = this.lerp(followerX, mouseX, 0.15);
        followerY = this.lerp(followerY, mouseY, 0.15);
        
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        cursorFollower.style.transform = `translate(${followerX - 15}px, ${followerY - 15}px)`;
        
        requestAnimationFrame(animateCursor);
    };
    
    animateCursor();
    
    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .service-card, .partner-logo, .cta-button');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            this.elements.body.classList.add('cursor-hover');
        });
        
        el.addEventListener('mouseleave', () => {
            this.elements.body.classList.remove('cursor-hover');
        });
    });
};

ConnectraApp.handleMouseMove = function(e) {
    if (this.elements.cursor) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        // Update cursor position variables
        this.mouseX = mouseX;
        this.mouseY = mouseY;
    }
};

ConnectraApp.handleMouseEnter = function(e) {
    if (this.elements.cursor) {
        this.elements.cursor.style.opacity = '1';
        this.elements.cursorFollower.style.opacity = '1';
    }
};

ConnectraApp.handleMouseLeave = function(e) {
    if (this.elements.cursor) {
        this.elements.cursor.style.opacity = '0';
        this.elements.cursorFollower.style.opacity = '0';
    }
};

// Animations
ConnectraApp.initAnimations = function() {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100,
            disable: window.innerWidth < 768 ? true : false
        });
    }
    
    // Add custom animation classes
    this.initCustomAnimations();
};

ConnectraApp.initCustomAnimations = function() {
    // Stagger animations for cards
    const observeStagger = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const container = entry.target;
                const items = container.querySelectorAll('.stagger-item');
                
                container.classList.add('animate');
                
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('animate');
                    }, index * 100);
                });
                
                observer.unobserve(container);
            }
        });
    };
    
    const staggerObserver = new IntersectionObserver(observeStagger, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.stagger-container').forEach(container => {
        staggerObserver.observe(container);
    });
    
    // Text reveal animations
    const observeTextReveal = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    };
    
    const textRevealObserver = new IntersectionObserver(observeTextReveal, {
        threshold: 0.5
    });
    
    document.querySelectorAll('.text-reveal').forEach(element => {
        // Wrap text in spans for animation
        const text = element.textContent;
        const words = text.split(' ');
        element.innerHTML = words.map(word => 
            `<span class="text-line">${word}</span>`
        ).join(' ');
        
        textRevealObserver.observe(element);
    });
};

ConnectraApp.initPageAnimations = function() {
    // Page load animation
    this.elements.body.classList.add('page-loaded');
    
    // Animate hero elements
    const heroElements = this.elements.hero?.querySelectorAll('[data-aos]');
    if (heroElements) {
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('aos-animate');
            }, index * 200);
        });
    }
};

// Parallax Effects
ConnectraApp.initParallax = function() {
    this.parallaxElements = document.querySelectorAll('.parallax-element');
    this.updateParallax();
};

ConnectraApp.updateParallax = function() {
    if (this.isMobile || this.parallaxElements.length === 0) return;
    
    const scrollTop = window.pageYOffset;
    
    this.parallaxElements.forEach((element, index) => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrollTop * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
};

// Counter Animations
ConnectraApp.initCounters = function() {
    const counters = this.elements.counters;
    if (counters.length === 0) return;
    
    const observeCounters = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    };
    
    const counterObserver = new IntersectionObserver(observeCounters, {
        threshold: 0.5
    });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
};

ConnectraApp.animateCounter = function(element) {
    const target = parseInt(element.dataset.count);
    const duration = 2000; // 2 seconds
    const start = performance.now();
    const startValue = 0;
    
    const updateCounter = (currentTime) => {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        // Use easing function for smooth animation
        const easedProgress = this.easeOutCubic(progress);
        const currentValue = Math.floor(easedProgress * target);
        
        element.textContent = currentValue.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    };
    
    requestAnimationFrame(updateCounter);
};

// Carousels
ConnectraApp.initCarousels = function() {
    // Partners carousel
    const partnersCarousel = document.querySelector('.partners-carousel');
    if (partnersCarousel && typeof Swiper !== 'undefined') {
        new Swiper(partnersCarousel, {
            slidesPerView: 'auto',
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 2000,
                disableOnInteraction: false,
            },
            speed: 800,
            breakpoints: {
                320: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                768: {
                    slidesPerView: 4,
                    spaceBetween: 30,
                },
                1024: {
                    slidesPerView: 6,
                    spaceBetween: 40,
                }
            }
        });
    }
};

// Intersection Observer for performance
ConnectraApp.initIntersectionObserver = function() {
    const observeElements = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Add animation classes
                if (element.classList.contains('slide-up-card')) {
                    element.classList.add('in-view');
                }
                
                // Trigger custom animations
                if (element.classList.contains('service-card')) {
                    setTimeout(() => {
                        element.classList.add('animated');
                    }, Math.random() * 300);
                }
                
                observer.unobserve(element);
            }
        });
    };
    
    const elementObserver = new IntersectionObserver(observeElements, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe service cards
    this.elements.serviceCards.forEach(card => {
        card.classList.add('slide-up-card');
        elementObserver.observe(card);
    });
    
    // Observe other animated elements
    document.querySelectorAll('.industry-card, .partner-category, .value-prop').forEach(element => {
        element.classList.add('slide-up-card');
        elementObserver.observe(element);
    });
};

// Smooth Scroll
ConnectraApp.initSmoothScroll = function() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Scroll indicator
    if (this.elements.scrollIndicator) {
        this.elements.scrollIndicator.addEventListener('click', () => {
            const servicesSection = document.getElementById('services');
            if (servicesSection) {
                servicesSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
};

// Event Handlers
ConnectraApp.handleScroll = function() {
    this.scrollY = window.pageYOffset;
    
    if (!this.ticking) {
        requestAnimationFrame(() => {
            this.updateNavbar();
            this.updateParallax();
            this.updateBackToTop();
            this.ticking = false;
        });
        this.ticking = true;
    }
};

ConnectraApp.handleResize = function() {
    this.isMobile = window.innerWidth <= 768;
    
    // Reinitialize AOS on resize
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
    
    // Update cursor visibility
    if (this.isMobile && this.elements.cursor) {
        this.elements.cursor.style.display = 'none';
        this.elements.cursorFollower.style.display = 'none';
        this.elements.body.style.cursor = 'auto';
    } else if (!this.isMobile && this.elements.cursor) {
        this.elements.cursor.style.display = 'block';
        this.elements.cursorFollower.style.display = 'block';
        this.elements.body.style.cursor = 'none';
    }
};

ConnectraApp.handleLoad = function() {
    // Additional load handling if needed
    this.elements.body.classList.add('fully-loaded');
};

ConnectraApp.handleClick = function(e) {
    const target = e.target;
    
    // Ripple effect for buttons
    if (target.classList.contains('ripple') || target.closest('.ripple')) {
        this.createRipple(e, target.classList.contains('ripple') ? target : target.closest('.ripple'));
    }
    
    // Back to top button
    if (target.closest('#back-to-top')) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
};

ConnectraApp.handleKeydown = function(e) {
    // Escape key to close mobile menu
    if (e.key === 'Escape') {
        const hamburger = this.elements.hamburger;
        const mobileMenuOverlay = this.elements.mobileMenuOverlay;
        
        if (mobileMenuOverlay && mobileMenuOverlay.classList.contains('active')) {
            hamburger?.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            this.elements.body.classList.remove('menu-open');
        }
    }
};

ConnectraApp.handleTouchStart = function(e) {
    // Handle touch interactions for mobile
    this.touchStartY = e.touches[0].clientY;
};

ConnectraApp.handleTouchMove = function(e) {
    // Prevent overscroll on iOS
    const touch = e.touches[0];
    const touchY = touch.clientY;
    
    // Add any touch-specific interactions here
};

// Back to Top Button
ConnectraApp.updateBackToTop = function() {
    const backToTop = this.elements.backToTop;
    if (!backToTop) return;
    
    if (this.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
};

// Ripple Effect
ConnectraApp.createRipple = function(e, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple-effect');
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
};

// Particle System (Optional Enhancement)
ConnectraApp.initParticles = function() {
    const particleContainer = document.querySelector('.animated-particles');
    if (!particleContainer || this.isMobile) return;
    
    const createParticle = () => {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random positioning
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 10 + 5) + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        
        particleContainer.appendChild(particle);
        
        // Remove after animation
        setTimeout(() => {
            particle.remove();
        }, 15000);
    };
    
    // Create particles periodically
    setInterval(createParticle, 2000);
    
    // Create initial particles
    for (let i = 0; i < 10; i++) {
        setTimeout(createParticle, i * 200);
    }
};

// Form Enhancements
ConnectraApp.initForms = function() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Newsletter form
        if (form.classList.contains('newsletter-form')) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const email = form.querySelector('input[type="email"]').value;
                if (email) {
                    // Simulate subscription
                    const button = form.querySelector('button');
                    const originalText = button.innerHTML;
                    
                    button.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
                    button.style.background = 'var(--accent-gold)';
                    
                    setTimeout(() => {
                        button.innerHTML = originalText;
                        button.style.background = '';
                        form.reset();
                    }, 3000);
                }
            });
        }
    });
};

// Performance Monitoring
ConnectraApp.monitorPerformance = function() {
    // Monitor performance and log to console in development
    const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
            if (entry.entryType === 'navigation') {
                console.log(`Page load time: ${entry.loadEventEnd - entry.loadEventStart}ms`);
            }
        });
    });
    
    observer.observe({ entryTypes: ['navigation'] });
    
    // Monitor long tasks
    if ('PerformanceObserver' in window) {
        const longTaskObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
                console.warn(`Long task detected: ${entry.duration}ms`);
            });
        });
        
        try {
            longTaskObserver.observe({ entryTypes: ['longtask'] });
        } catch (e) {
            // Longtask observer not supported
        }
    }
};

// Error Handling
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    // Could send to analytics service in production
});

// Unhandled Promise Rejection
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled Promise Rejection:', e.reason);
    // Could send to analytics service in production
});

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    ConnectraApp.init();
});

// Initialize forms and particles after full page load
window.addEventListener('load', () => {
    ConnectraApp.initForms();
    ConnectraApp.initParticles();
    ConnectraApp.monitorPerformance();
});