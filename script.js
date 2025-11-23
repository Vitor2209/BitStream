// BitStream - Enhanced Premium Script

// ============================================
// CONFIGURAÇÕES - Edite seu número do WhatsApp
// ============================================
const WHATSAPP_NUMBER = '5511999999999';

// FORMULÁRIO: Edite seu email no index.html 
// na linha: action="https://formsubmit.co/SEU_EMAIL_AQUI@gmail.com"

// ============================================
// PRODUTOS DA LOJA
// ============================================
const productsData = [
    {
        id: 1,
        title: 'Dashboard Admin Premium',
        category: 'dashboards',
        price: 'R$ 499',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
        description: 'Painel administrativo completo com gráficos e relatórios',
        tags: ['React', 'Dashboard', 'Premium']
    },
    {
        id: 2,
        title: 'Landing Page SaaS',
        category: 'landing',
        price: 'R$ 299',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=600&q=80',
        description: 'Template de landing page otimizado para conversão',
        tags: ['HTML', 'CSS', 'JavaScript']
    },
    {
        id: 3,
        title: 'E-commerce Template',
        category: 'templates',
        price: 'R$ 699',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
        description: 'Template completo para loja virtual',
        tags: ['React', 'E-commerce', 'API']
    },
    {
        id: 4,
        title: 'Sistema de Automação',
        category: 'scripts',
        price: 'R$ 399',
        rating: 4,
        image: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=600&q=80',
        description: 'Scripts para automação de tarefas repetitivas',
        tags: ['Python', 'Automation']
    },
    {
        id: 5,
        title: 'Componentes React Pro',
        category: 'componentes',
        price: 'R$ 199',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80',
        description: 'Biblioteca de componentes reutilizáveis',
        tags: ['React', 'Components', 'UI']
    },
    {
        id: 6,
        title: 'E-book: Desenvolvimento Web',
        category: 'ebooks',
        price: 'R$ 49',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&q=80',
        description: 'Guia completo de desenvolvimento web moderno',
        tags: ['E-book', 'Education']
    }
];

// ============================================
// INICIALIZAÇÃO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initHeader();
    initHeroCanvas();
    initWhatsApp();
    initShopPage();
    initScrollAnimations();
    initCursor();
});

// ============================================
// HEADER
// ============================================
function initHeader() {
    const header = document.getElementById('header');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const nav = document.getElementById('nav');

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // Mobile menu
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            nav.classList.toggle('mobile-open');
            mobileMenuBtn.classList.toggle('active');
            
            // Adiciona efeito de ripple no clique
            createRipple(e, mobileMenuBtn);
            
            // Previne scroll quando menu está aberto
            if (nav.classList.contains('mobile-open')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close on link click
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('mobile-open');
                mobileMenuBtn.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                nav.classList.remove('mobile-open');
                mobileMenuBtn.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Active page detection
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Efeito ripple ao clicar no menu
function createRipple(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(0, 217, 255, 0.6) 0%, transparent 70%);
        top: ${y}px;
        left: ${x}px;
        pointer-events: none;
        animation: ripple-animation 0.6s ease-out;
    `;

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
} 

    // Active page detection
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });


// ============================================
// HERO CANVAS - Animação Avançada
// ============================================
function initHeroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = Math.min(70, Math.floor(width / 15));
    const mouse = { x: null, y: null, radius: 150 };

    // Create particles
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.radius = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.5 + 0.3;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Mouse interaction
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    this.vx -= Math.cos(angle) * force * 0.5;
                    this.vy -= Math.sin(angle) * force * 0.5;
                }
            }

            // Speed limit
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (speed > 2) {
                this.vx = (this.vx / speed) * 2;
                this.vy = (this.vy / speed) * 2;
            }
        }

        draw() {
            ctx.fillStyle = `rgba(0, 217, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();

            // Glow effect
            ctx.shadowBlur = 15;
            ctx.shadowColor = 'rgba(0, 217, 255, 0.8)';
        }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Mouse tracking
    canvas.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Draw connections
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'rgba(0, 217, 255, 0.15)';
        ctx.lineWidth = 1;

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    const opacity = 1 - (distance / 150);
                    ctx.strokeStyle = `rgba(0, 217, 255, ${opacity * 0.2})`;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });
}

// ============================================
// WHATSAPP BUTTON
// ============================================
function initWhatsApp() {
    const whatsappBtn = document.getElementById('whatsappBtn');
    if (!whatsappBtn) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 400) {
            whatsappBtn.classList.add('visible');
        } else {
            whatsappBtn.classList.remove('visible');
        }
    });

    whatsappBtn.addEventListener('click', () => {
        const message = encodeURIComponent('Olá! Gostaria de saber mais sobre os serviços da BitStream.');
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
    });
}

// ============================================
// FORMULÁRIO agora usa FormSubmit.co
// Não precisa de JavaScript! Funciona direto.
// Edite seu email no index.html
// ============================================

// ============================================
// SHOP PAGE
// ============================================
function initShopPage() {
    if (!window.location.pathname.includes('loja.html')) return;

    const productsGrid = document.getElementById('productsGrid');
    const searchInput = document.getElementById('searchInput');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const noResults = document.getElementById('noResults');

    let currentCategory = 'todos';
    let currentSearch = '';

    function renderProducts() {
        const filtered = productsData.filter(product => {
            const matchesCategory = currentCategory === 'todos' || product.category === currentCategory;
            const matchesSearch = product.title.toLowerCase().includes(currentSearch.toLowerCase()) ||
                                  product.description.toLowerCase().includes(currentSearch.toLowerCase());
            return matchesCategory && matchesSearch;
        });

        if (filtered.length === 0) {
            productsGrid.innerHTML = '';
            noResults.style.display = 'block';
            return;
        }

        noResults.style.display = 'none';
        productsGrid.innerHTML = filtered.map((product, index) => `
            <div class="product-card card" style="animation: fade-in 0.6s ease ${index * 0.1}s both">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.title}" loading="lazy">
                    <div class="product-category-badge">${getCategoryName(product.category)}</div>
                </div>
                <div class="product-content">
                    <div class="product-rating">
                        ${Array(product.rating).fill('').map(() => `
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--brand-cyan)" stroke="var(--brand-cyan)" stroke-width="2">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                        `).join('')}
                    </div>
                    <h3>${product.title}</h3>
                    <p>${product.description}</p>
                    <div class="product-tags">
                        ${product.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="product-footer">
                        <div class="product-price">${product.price}</div>
                        <button class="btn-primary" onclick="buyProduct('${product.title}', '${product.price}')">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="9" cy="21" r="1"/>
                                <circle cx="20" cy="21" r="1"/>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                            </svg>
                            <span>Comprar</span>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function getCategoryName(cat) {
        const names = {
            'dashboards': 'Dashboards',
            'landing': 'Landing Pages',
            'templates': 'Templates',
            'scripts': 'Scripts',
            'componentes': 'Componentes',
            'ebooks': 'E-books'
        };
        return names[cat] || cat;
    }

    // Category filter
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            renderProducts();
        });
    });

    // Search
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            currentSearch = this.value;
            renderProducts();
        });
    }

    renderProducts();
}

// Buy product
window.buyProduct = function(productName, price) {
    const message = encodeURIComponent(`Olá! Tenho interesse no produto: ${productName} (${price})`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
};

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.card, .service-card, .portfolio-card, .testimonial-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });
}

// ============================================
// CUSTOM CURSOR
// ============================================
function initCursor() {
    if (window.innerWidth < 768) return; // Skip on mobile

    const cursor = document.createElement('div');
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid var(--brand-cyan);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: all 0.1s ease;
        mix-blend-mode: difference;
        display: none;
    `;
    document.body.appendChild(cursor);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.display = 'block';
    });

    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        cursor.style.left = cursorX - 10 + 'px';
        cursor.style.top = cursorY - 10 + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Scale on hover
    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.borderColor = 'var(--brand-purple)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.borderColor = 'var(--brand-cyan)';
        });
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

console.log('%c🚀 BitStream carregado!', 'color: #00D9FF; font-size: 16px; font-weight: bold;');
console.log('%cPowered by BitStream', 'color: #9D4EDD; font-size: 12px;');

