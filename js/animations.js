/* ================================
   CONNECTRA ADVANCED ANIMATIONS
   Interactive Effects & Micro-interactions
   ================================ */

// Advanced Animation Controller
const AnimationController = {
    animations: new Map(),
    rafId: null,
    isRunning: false,
    
    init() {
        this.initScrollAnimations();
        this.initHoverEffects();
        this.initMorphingShapes();
        this.initTextAnimations();
        this.initCardAnimations();
        this.initBackgroundEffects();
        this.initInteractiveElements();
        this.startAnimationLoop();
    },
    
    startAnimationLoop() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        const animate = () => {
            this.updateAnimations();
            this.rafId = requestAnimationFrame(animate);
        };
        animate();
    },
    
    stopAnimationLoop() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
            this.isRunning = false;
        }
    },
    
    updateAnimations() {
        this.animations.forEach((animation, key) => {
            if (animation.update) {
                animation.update();
            }
        });
    },
    
    addAnimation(key, animation) {
        this.animations.set(key, animation);
    },
    
    removeAnimation(key) {
        this.animations.delete(key);
    }
};

// Scroll-triggered Animations
AnimationController.initScrollAnimations = function() {
    const scrollElements = document.querySelectorAll('[data-scroll-animation]');
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animationType = element.dataset.scrollAnimation;
                
                switch (animationType) {
                    case 'fadeInUp':
                        this.fadeInUp(element);
                        break;
                    case 'slideInLeft':
                        this.slideInLeft(element);
                        break;
                    case 'slideInRight':
                        this.slideInRight(element);
                        break;
                    case 'scaleIn':
                        this.scaleIn(element);
                        break;
                    case 'rotateIn':
                        this.rotateIn(element);
                        break;
                    default:
                        this.fadeInUp(element);
                }
                
                scrollObserver.unobserve(element);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    scrollElements.forEach(element => {
        scrollObserver.observe(element);
    });
};

// Individual Animation Methods
AnimationController.fadeInUp = function(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(50px)';
    element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    
    requestAnimationFrame(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    });
};

AnimationController.slideInLeft = function(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateX(-100px)';
    element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    
    requestAnimationFrame(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateX(0)';
    });
};

AnimationController.slideInRight = function(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateX(100px)';
    element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    
    requestAnimationFrame(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateX(0)';
    });
};

AnimationController.scaleIn = function(element) {
    element.style.opacity = '0';
    element.style.transform = 'scale(0.8)';
    element.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
    
    requestAnimationFrame(() => {
        element.style.opacity = '1';
        element.style.transform = 'scale(1)';
    });
};

AnimationController.rotateIn = function(element) {
    element.style.opacity = '0';
    element.style.transform = 'rotate(-10deg) scale(0.9)';
    element.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
    
    requestAnimationFrame(() => {
        element.style.opacity = '1';
        element.style.transform = 'rotate(0deg) scale(1)';
    });
};

// Advanced Hover Effects
AnimationController.initHoverEffects = function() {
    // 3D Tilt Effect for Cards
    const tiltCards = document.querySelectorAll('.service-card, .industry-card, .partner-category');
    
    tiltCards.forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            this.addTiltEffect(card);
        });
        
        card.addEventListener('mouseleave', (e) => {
            this.removeTiltEffect(card);
        });
        
        card.addEventListener('mousemove', (e) => {
            this.updateTiltEffect(card, e);
        });
    });
    
    // Magnetic Effect for Buttons
    const magneticButtons = document.querySelectorAll('.cta-button');
    
    magneticButtons.forEach(button => {
        button.addEventListener('mouseenter', (e) => {
            this.addMagneticEffect(button);
        });
        
        button.addEventListener('mouseleave', (e) => {
            this.removeMagneticEffect(button);
        });
        
        button.addEventListener('mousemove', (e) => {
            this.updateMagneticEffect(button, e);
        });
    });
};

AnimationController.addTiltEffect = function(element) {
    element.style.transform = 'perspective(1000px)';
    element.style.transition = 'transform 0.1s ease-out';
};

AnimationController.removeTiltEffect = function(element) {
    element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    element.style.transition = 'transform 0.3s ease-out';
};

AnimationController.updateTiltEffect = function(element, event) {
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / centerY * -10; // Max 10deg
    const rotateY = (x - centerX) / centerX * 10;   // Max 10deg
    
    element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
};

AnimationController.addMagneticEffect = function(element) {
    element.style.transition = 'transform 0.2s ease-out';
};

AnimationController.removeMagneticEffect = function(element) {
    element.style.transform = 'translate(0, 0) scale(1)';
    element.style.transition = 'transform 0.3s ease-out';
};

AnimationController.updateMagneticEffect = function(element, event) {
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const deltaX = (x - centerX) / centerX * 15; // Max 15px movement
    const deltaY = (y - centerY) / centerY * 15;
    
    element.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.05)`;
};

// Morphing Shapes
AnimationController.initMorphingShapes = function() {
    const shapes = document.querySelectorAll('.floating-shapes .shape');
    
    shapes.forEach((shape, index) => {
        const morphAnimation = {
            element: shape,
            time: 0,
            speed: 0.5 + Math.random() * 0.5,
            update: () => {
                morphAnimation.time += morphAnimation.speed * 0.016; // 60fps
                
                const morph1 = Math.sin(morphAnimation.time) * 0.5 + 0.5;
                const morph2 = Math.cos(morphAnimation.time * 1.3) * 0.5 + 0.5;
                const morph3 = Math.sin(morphAnimation.time * 0.7) * 0.5 + 0.5;
                
                const borderRadius = `
                    ${60 + morph1 * 40}% ${40 + morph2 * 20}% 
                    ${30 + morph3 * 40}% ${70 + morph1 * 30}% / 
                    ${60 + morph2 * 30}% ${30 + morph3 * 40}% 
                    ${70 + morph1 * 20}% ${40 + morph2 * 60}%
                `;
                
                shape.style.borderRadius = borderRadius;
            }
        };
        
        this.addAnimation(`morph-${index}`, morphAnimation);
    });
};

// Text Animations
AnimationController.initTextAnimations = function() {
    // Typewriter effect
    const typewriterElements = document.querySelectorAll('.text-typewriter');
    
    typewriterElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        element.style.borderRight = '3px solid var(--accent-gold)';
        
        let charIndex = 0;
        const typeAnimation = {
            update: () => {
                if (charIndex < text.length) {
                    element.textContent += text.charAt(charIndex);
                    charIndex++;
                    
                    // Simulate typing speed variation
                    setTimeout(() => {}, Math.random() * 100 + 50);
                } else {
                    // Remove cursor after typing is complete
                    setTimeout(() => {
                        element.style.borderRight = 'none';
                    }, 1000);
                    
                    this.removeAnimation(`typewriter-${element.id}`);
                }
            }
        };
        
        // Start typing after element is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.addAnimation(`typewriter-${element.id}`, typeAnimation);
                    observer.unobserve(element);
                }
            });
        });
        
        observer.observe(element);
    });
    
    // Text glow effect
    const glowTexts = document.querySelectorAll('.text-glow');
    
    glowTexts.forEach((text, index) => {
        const glowAnimation = {
            element: text,
            time: 0,
            update: () => {
                glowAnimation.time += 0.016;
                const intensity = Math.sin(glowAnimation.time * 2) * 0.3 + 0.7;
                text.style.textShadow = `0 0 ${20 * intensity}px rgba(212, 175, 55, ${0.5 * intensity})`;
            }
        };
        
        this.addAnimation(`glow-${index}`, glowAnimation);
    });
};

// Card Animations
AnimationController.initCardAnimations = function() {
    // Flip cards
    const flipCards = document.querySelectorAll('.flip-card');
    
    flipCards.forEach(card => {
        let isFlipped = false;
        
        card.addEventListener('click', () => {
            isFlipped = !isFlipped;
            const inner = card.querySelector('.flip-card-inner');
            
            if (inner) {
                inner.style.transform = isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
            }
        });
    });
    
    // Expanding cards
    const expandCards = document.querySelectorAll('.expand-card');
    
    expandCards.forEach(card => {
        const content = card.querySelector('.expand-content');
        const trigger = card.querySelector('.expand-trigger');
        
        if (content && trigger) {
            const originalHeight = content.scrollHeight;
            content.style.height = '0px';
            content.style.overflow = 'hidden';
            content.style.transition = 'height 0.3s ease-out';
            
            trigger.addEventListener('click', () => {
                const isExpanded = content.style.height !== '0px';
                
                if (isExpanded) {
                    content.style.height = '0px';
                    trigger.textContent = 'Read More';
                } else {
                    content.style.height = originalHeight + 'px';
                    trigger.textContent = 'Read Less';
                }
            });
        }
    });
};

// Background Effects
AnimationController.initBackgroundEffects = function() {
    // Animated gradient backgrounds
    const gradientBgs = document.querySelectorAll('.gradient-shift');
    
    gradientBgs.forEach((bg, index) => {
        const gradientAnimation = {
            element: bg,
            time: 0,
            speed: 0.3 + Math.random() * 0.2,
            update: () => {
                gradientAnimation.time += gradientAnimation.speed * 0.016;
                
                const hue1 = (gradientAnimation.time * 30) % 360;
                const hue2 = (gradientAnimation.time * 30 + 120) % 360;
                const hue3 = (gradientAnimation.time * 30 + 240) % 360;
                
                bg.style.background = `
                    linear-gradient(-45deg, 
                        hsl(${hue1}, 70%, 50%), 
                        hsl(${hue2}, 70%, 50%), 
                        hsl(${hue3}, 70%, 50%)
                    )
                `;
            }
        };
        
        this.addAnimation(`gradient-${index}`, gradientAnimation);
    });
    
    // Particle system for hero background
    this.initParticleSystem();
};

AnimationController.initParticleSystem = function() {
    const particleContainer = document.querySelector('.animated-particles');
    if (!particleContainer || window.innerWidth < 768) return;
    
    const particles = [];
    const particleCount = 50;
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        const particle = {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 4 + 1,
            opacity: Math.random() * 0.5 + 0.3,
            element: document.createElement('div')
        };
        
        particle.element.className = 'particle';
        particle.element.style.position = 'absolute';
        particle.element.style.width = particle.size + 'px';
        particle.element.style.height = particle.size + 'px';
        particle.element.style.backgroundColor = Math.random() > 0.5 ? '#D4AF37' : '#B87333';
        particle.element.style.borderRadius = '50%';
        particle.element.style.opacity = particle.opacity;
        particle.element.style.pointerEvents = 'none';
        
        particleContainer.appendChild(particle.element);
        particles.push(particle);
    }
    
    // Animate particles
    const particleAnimation = {
        particles: particles,
        update: () => {
            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Wrap around screen
                if (particle.x > window.innerWidth) particle.x = 0;
                if (particle.x < 0) particle.x = window.innerWidth;
                if (particle.y > window.innerHeight) particle.y = 0;
                if (particle.y < 0) particle.y = window.innerHeight;
                
                particle.element.style.left = particle.x + 'px';
                particle.element.style.top = particle.y + 'px';
            });
        }
    };
    
    this.addAnimation('particles', particleAnimation);
};

// Interactive Elements
AnimationController.initInteractiveElements = function() {
    // Progress bars
    const progressBars = document.querySelectorAll('.progress-bar');
    
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const fill = progressBar.querySelector('.progress-fill');
                const percentage = progressBar.dataset.percentage || 100;
                
                if (fill) {
                    setTimeout(() => {
                        fill.style.width = percentage + '%';
                        fill.classList.add('animate');
                    }, 300);
                }
                
                progressObserver.unobserve(progressBar);
            }
        });
    });
    
    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });
    
    // Loading animations
    const loadingElements = document.querySelectorAll('.loading-animation');
    
    loadingElements.forEach(element => {
        const dots = element.querySelectorAll('.loading-dot');
        
        dots.forEach((dot, index) => {
            dot.style.animationDelay = `${index * 0.1}s`;
        });
    });
    
    // Interactive buttons with sound effect simulation
    const interactiveButtons = document.querySelectorAll('.interactive-btn');
    
    interactiveButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = size + 'px';
            ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s ease-out';
            ripple.style.pointerEvents = 'none';
            
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
};

// Scroll-based Parallax
AnimationController.initScrollParallax = function() {
    const parallaxElements = document.querySelectorAll('.parallax-scroll');
    
    const updateParallax = () => {
        const scrollTop = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.speed) || 0.5;
            const yPos = -(scrollTop * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    };
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    });
};

// Performance-aware animation management
AnimationController.optimizePerformance = function() {
    // Pause animations when page is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            this.stopAnimationLoop();
        } else {
            this.startAnimationLoop();
        }
    });
    
    // Reduce animations on low-end devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
        // Reduce particle count and animation complexity
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            if (index % 2 === 0) {
                particle.remove();
            }
        });
    }
    
    // Battery-aware animations
    if ('getBattery' in navigator) {
        navigator.getBattery().then((battery) => {
            if (battery.level < 0.2) {
                // Reduce animations when battery is low
                this.stopAnimationLoop();
            }
            
            battery.addEventListener('levelchange', () => {
                if (battery.level < 0.2) {
                    this.stopAnimationLoop();
                } else if (!this.isRunning) {
                    this.startAnimationLoop();
                }
            });
        });
    }
};

// CSS Animation Keyframes (Added via JavaScript)
AnimationController.addCustomKeyframes = function() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes particleFloat {
            0% {
                transform: translateY(100vh) rotate(0deg);
                opacity: 0;
            }
            10%, 90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100px) rotate(360deg);
                opacity: 0;
            }
        }
        
        @keyframes morphBlob {
            0%, 100% {
                border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
            }
            50% {
                border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
            }
        }
        
        @keyframes floatGlow {
            0%, 100% {
                transform: translateY(0px);
                filter: brightness(1);
            }
            50% {
                transform: translateY(-10px);
                filter: brightness(1.2);
            }
        }
        
        @keyframes textShimmer {
            0% {
                background-position: -200% center;
            }
            100% {
                background-position: 200% center;
            }
        }
        
        @keyframes pulseGlow {
            0%, 100% {
                box-shadow: 0 0 5px rgba(212, 175, 55, 0.5);
            }
            50% {
                box-shadow: 0 0 20px rgba(212, 175, 55, 0.8), 0 0 30px rgba(212, 175, 55, 0.4);
            }
        }
    `;
    
    document.head.appendChild(style);
};

// Initialize all animations
document.addEventListener('DOMContentLoaded', () => {
    AnimationController.addCustomKeyframes();
    AnimationController.init();
    AnimationController.optimizePerformance();
    AnimationController.initScrollParallax();
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    AnimationController.stopAnimationLoop();
});