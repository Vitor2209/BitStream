/**
 * Vitor Edit Studio - Sales Landing Page
 * Pure Vanilla JavaScript - No frameworks
 */

(function() {
    'use strict';

    // ========== DOM Elements ==========
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const navbar = document.getElementById('navbar');
    const floatingBuyBtn = document.getElementById('floatingBuyBtn');
    const contactForm = document.getElementById('contactForm');
    const faqItems = document.querySelectorAll('.faq-item');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

    // ========== Mobile Menu Toggle ==========
    function toggleMobileMenu() {
        mobileMenu.classList.toggle('active');
        
        // Animate hamburger to X
        const spans = hamburger.querySelectorAll('span');
        if (mobileMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }

    // ========== Scroll Handling ==========
    let lastScrollY = 0;
    
    function handleScroll() {
        const currentScrollY = window.scrollY;
        
        // Show/hide floating buy button after scrolling past hero
        if (currentScrollY > 600) {
            floatingBuyBtn.classList.add('visible');
        } else {
            floatingBuyBtn.classList.remove('visible');
        }
        
        // Navbar background opacity based on scroll
        if (currentScrollY > 50) {
            navbar.style.background = 'rgba(13, 1, 24, 0.95)';
        } else {
            navbar.style.background = 'rgba(13, 1, 24, 0.8)';
        }
        
        lastScrollY = currentScrollY;
    }

    // ========== Smooth Scroll ==========
    function smoothScrollTo(targetId) {
        const target = document.querySelector(targetId);
        if (target) {
            const navHeight = navbar.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    // ========== FAQ Accordion ==========
    function initFAQ() {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                });
                
                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                    question.setAttribute('aria-expanded', 'true');
                }
            });
            
            // Keyboard accessibility
            question.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    question.click();
                }
            });
        });
    }

    // ========== Form Validation ==========
    function validateForm(e) {
        e.preventDefault();
        
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');
        
        const nameError = document.getElementById('nameError');
        const emailError = document.getElementById('emailError');
        const messageError = document.getElementById('messageError');
        
        let isValid = true;
        
        // Clear previous errors
        nameError.textContent = '';
        emailError.textContent = '';
        messageError.textContent = '';
        
        // Validate name
        if (!name.value.trim()) {
            nameError.textContent = 'Please enter your name.';
            isValid = false;
        } else if (name.value.trim().length < 2) {
            nameError.textContent = 'Name must be at least 2 characters.';
            isValid = false;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
            emailError.textContent = 'Please enter your email.';
            isValid = false;
        } else if (!emailRegex.test(email.value.trim())) {
            emailError.textContent = 'Please enter a valid email address.';
            isValid = false;
        }
        
        // Validate message
        if (!message.value.trim()) {
            messageError.textContent = 'Please enter your message.';
            isValid = false;
        } else if (message.value.trim().length < 10) {
            messageError.textContent = 'Message must be at least 10 characters.';
            isValid = false;
        }
        
        // If valid, open mailto
        if (isValid) {
            const subject = encodeURIComponent('Enquiry from Vitor Edit Studio Website');
            const body = encodeURIComponent(
                `Name: ${name.value.trim()}\n` +
                `Email: ${email.value.trim()}\n\n` +
                `Message:\n${message.value.trim()}`
            );
            
            window.location.href = `mailto:vitor@vitoredit.studio?subject=${subject}&body=${body}`;
            
            // Reset form
            contactForm.reset();
            
            // Show success feedback
            showToast('Message prepared! Your email client will open.');
        }
        
        return false;
    }

    // ========== Toast Notification ==========
    function showToast(message) {
        // Remove existing toast if any
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #a855f7, #7c3aed);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 0.9rem;
            font-weight: 500;
            z-index: 10000;
            box-shadow: 0 4px 20px rgba(168, 85, 247, 0.4);
            animation: toastIn 0.3s ease, toastOut 0.3s ease 2.7s forwards;
        `;
        
        // Add animation keyframes if not exists
        if (!document.getElementById('toastStyles')) {
            const style = document.createElement('style');
            style.id = 'toastStyles';
            style.textContent = `
                @keyframes toastIn {
                    from { opacity: 0; transform: translateX(-50%) translateY(20px); }
                    to { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
                @keyframes toastOut {
                    from { opacity: 1; transform: translateX(-50%) translateY(0); }
                    to { opacity: 0; transform: translateX(-50%) translateY(20px); }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(toast);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // ========== Intersection Observer for Animations ==========
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll(
            '.service-card, .testimonial-card, .step-card, .ba-card, .portfolio-card'
        );
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(el);
        });
    }

    // ========== Handle all anchor clicks for smooth scroll ==========
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href !== '#') {
                    e.preventDefault();
                    smoothScrollTo(href);
                    closeMobileMenu();
                }
            });
        });
    }

    // ========== Initialize ==========
    function init() {
        // Mobile menu toggle
        if (hamburger) {
            hamburger.addEventListener('click', toggleMobileMenu);
        }
        
        // Close mobile menu on link click
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
        
        // Scroll handling
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check
        
        // FAQ accordion
        initFAQ();
        
        // Form validation
        if (contactForm) {
            contactForm.addEventListener('submit', validateForm);
        }
        
        // Smooth scroll
        initSmoothScroll();
        
        // Scroll animations
        initScrollAnimations();
        
        // Close mobile menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
        
        // Close mobile menu on click outside
        document.addEventListener('click', (e) => {
            if (mobileMenu.classList.contains('active') && 
                !mobileMenu.contains(e.target) && 
                !hamburger.contains(e.target)) {
                closeMobileMenu();
            }
        });
        
        console.log('Vitor Edit Studio - Landing page initialized');
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
