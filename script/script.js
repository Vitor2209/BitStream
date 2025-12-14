// ============================================
// BitStream Website - JavaScript
// ============================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initParticles();
    initContactForm();
    initScrollAnimations();
    initServiceSelection();
});

// ============================================
// Navigation
// ============================================
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    // Scroll effect for navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// ============================================
// Animated Particles Background
// ============================================
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    const size = Math.random() * 3 + 1;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    const opacity = Math.random() * 0.5 + 0.1;
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, rgba(0, 212, 255, ${opacity}) 0%, transparent 70%);
        border-radius: 50%;
        left: ${x}%;
        top: ${y}%;
        animation: float-particle ${duration}s ease-in-out infinite;
        animation-delay: ${delay}s;
        pointer-events: none;
    `;
    
    container.appendChild(particle);
}

// Add particle float animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes float-particle {
        0%, 100% {
            transform: translate(0, 0);
            opacity: 0;
        }
        10%, 90% {
            opacity: 1;
        }
        50% {
            transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px);
        }
    }
`;
document.head.appendChild(style);

// ============================================
// Contact Form
// ============================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                service: document.getElementById('service').value,
                budget: document.getElementById('budget').value,
                message: document.getElementById('message').value
            };
            
            // Simulate form submission (replace with actual API call)
            try {
                // Show loading state
                const submitButton = contactForm.querySelector('button[type=\"submit\"]');
                const originalText = submitButton.innerHTML;
                submitButton.innerHTML = '<span>Sending...</span>';
                submitButton.disabled = true;
                
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Log form data (in production, send to backend)
                console.log('Form submitted:', formData);
                
                // Show success message
                contactForm.style.display = 'none';
                formSuccess.classList.add('active');
                
                // Reset form after 5 seconds
                setTimeout(() => {
                    contactForm.reset();
                    contactForm.style.display = 'grid';
                    formSuccess.classList.remove('active');
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                }, 5000);
                
            } catch (error) {
                console.error('Form submission error:', error);
                alert('Sorry, there was an error submitting your message. Please try again.');
                
                // Reset button
                const submitButton = contactForm.querySelector('button[type=\"submit\"]');
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }
        });
    }
}

// ============================================
// Service Selection from URL
// ============================================
function initServiceSelection() {
    // Check if we're on the contact page
    if (!window.location.pathname.includes('contact.html')) return;
    
    // Get service from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    const productParam = urlParams.get('product');
    
    const serviceSelect = document.getElementById('service');
    const messageTextarea = document.getElementById('message');
    
    if (serviceSelect && serviceParam) {
        serviceSelect.value = serviceParam;
    }
    
    if (messageTextarea && productParam) {
        const productNames = {
            'landing-template': 'Landing Page Template',
            'dashboard-kit': 'Admin Dashboard UI Kit',
            'ecommerce-frontend': 'E-commerce Frontend',
            'react-library': 'React Component Library',
            'portfolio-template': 'Portfolio Template',
            'docs-template': 'Documentation Template'
        };
        
        const productName = productNames[productParam] || productParam;
        messageTextarea.value = `Hello! I'm interested in purchasing the ${productName}. Could you provide more information?`;
    }
}

// ============================================
// Scroll Animations
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .service-card, .product-card, .info-card');
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// ============================================
// Smooth Scroll for Anchor Links
// ============================================
document.querySelectorAll('a[href^=\"#\"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ============================================
// Performance: Lazy Load Images
// ============================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// Add Glow Effect on Mouse Move (Desktop Only)
// ============================================
if (window.innerWidth > 768) {
    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        // Create subtle glow effect at cursor position
        const glowElements = document.querySelectorAll('.feature-card, .service-card, .product-card');
        
        glowElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const elementX = rect.left + rect.width / 2;
            const elementY = rect.top + rect.height / 2;
            
            const distance = Math.sqrt(
                Math.pow(mouseX - elementX, 2) + 
                Math.pow(mouseY - elementY, 2)
            );
            
            if (distance < 300) {
                const intensity = 1 - (distance / 300);
                element.style.boxShadow = `0 10px 40px rgba(0, 212, 255, ${intensity * 0.3})`;
            }
        });
    });
}

// ============================================
// Console Welcome Message
// ============================================
console.log('%cBitStream Digital Solutions', 'color: #00d4ff; font-size: 24px; font-weight: bold; font-family: Cinzel, serif;');
console.log('%cBuilt with modern web technologies', 'color: #b8b8c8; font-size: 14px;');
console.log('%cInterested in working with us? Visit contact.html', 'color: #7b2cbf; font-size: 12px;');
