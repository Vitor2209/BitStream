// ============================================
// BitStream Website - JavaScript (FINAL)
// ============================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    initNavigation();
    initParticles();
    initScrollAnimations();
    initServiceSelection();
    initContactForm();
});

// ============================================
// Navigation
// ============================================
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    if (navToggle) {
        navToggle.addEventListener('click', function () {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// ============================================
// Particles Background
// ============================================
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 3 + 1;

        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, rgba(0,212,255,.5), transparent);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 20 + 10}s infinite;
        `;
        container.appendChild(particle);
    }
}

const style = document.createElement('style');
style.innerHTML = `
@keyframes float {
    0%,100% { transform: translate(0,0); opacity:0 }
    50% { transform: translate(30px,-30px); opacity:1 }
}`;
document.head.appendChild(style);

// ============================================
// REAL Contact Form (EMAIL FUNCIONANDO)
// ============================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const button = form.querySelector('button[type="submit"]');
        const originalText = button.innerHTML;

        button.innerHTML = '<span>Sending...</span>';
        button.disabled = true;

        const formData = new FormData(form);

        try {
            const response = await fetch(
                'https://formsubmit.co/ajax/contato.bitstream@gmail.com',
                {
                    method: 'POST',
                    headers: { 'Accept': 'application/json' },
                    body: formData
                }
            );

            if (response.ok) {
                form.style.display = 'none';
                success.style.display = 'block';
                form.reset();
            } else {
                alert('Something went wrong. Please try again.');
            }
        } catch (err) {
            alert('Error sending message. Check your connection.');
        } finally {
            button.innerHTML = originalText;
            button.disabled = false;
        }
    });
}

// ============================================
// Service Selection from URL
// ============================================
function initServiceSelection() {
    if (!window.location.pathname.includes('contact.html')) return;

    const params = new URLSearchParams(window.location.search);
    const service = params.get('service');
    const product = params.get('product');

    const serviceSelect = document.getElementById('service');
    const message = document.getElementById('message');

    if (service && serviceSelect) {
        serviceSelect.value = service;
    }

    if (product && message) {
        const products = {
            'landing-template': 'Landing Page Template',
            'dashboard-kit': 'Admin Dashboard UI Kit',
            'ecommerce-frontend': 'E-commerce Frontend',
            'react-library': 'React Component Library',
            'portfolio-template': 'Portfolio Template',
            'docs-template': 'Documentation Template'
        };

        message.value = `Hello! I'm interested in the ${products[product] || product}. Could you provide more details?`;
    }
}

// ============================================
// Scroll Animations
// ============================================
function initScrollAnimations() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = -1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.feature-card, .service-card, .product-card, .info-card')
        .forEach(el => {
            el.style.opacity = 0;
            el.style.transform = 'translateY(30px)';
            el.style.transition = '0.6s ease';
            observer.observe(el);
        });
}

// ============================================
// Smooth Scroll
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ============================================
// Console Branding
// ============================================
console.log('%cBitStream Digital Solutions', 'color:#00d4ff;font-size:24px;font-weight:bold');
console.log('%cProfessional Web Development', 'color:#aaa');

