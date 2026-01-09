const BASE_URL = '';

// WhatsApp (MVP sem backend): defina aqui seu número (somente dígitos, com DDI)
// Ex.: Brasil +55 31 99999-9999 => "5531999999999"
// Ex.: UK +44 7785 314195 => "447785314195"
const WHATSAPP_NUMBER = '447785314195';

// Preferência: abrir em WhatsApp Web/App
const WHATSAPP_BASE = 'https://wa.me/';

// Estado global da aplicação
// Descobre a URL correta do Shop dependendo de onde estamos (root /pages)
function getShopPageUrl() {
  // Single page: "Shop" é a seção de produtos
  return '#products';
}

const state = {
  cart: [],
  wishlist: [],
  products: [],
  deals: [],
  categories: [],
  trending: [],
  currentTab: 'best',
  productsFilter: 'all'
};

// Persistência simples (sem backend)
function loadPersistedState(){
  try{
    const cart = JSON.parse(localStorage.getItem('bs_shop_cart')||'[]');
    const wl = JSON.parse(localStorage.getItem('bs_shop_wishlist')||'[]');
    state.cart = Array.isArray(cart)?cart:[];
    state.wishlist = Array.isArray(wl)?wl:[];
  }catch(e){
    state.cart=[]; state.wishlist=[];
  }
}
function persistCart(){ localStorage.setItem('bs_shop_cart', JSON.stringify(state.cart)); }
function persistWishlist(){ localStorage.setItem('bs_shop_wishlist', JSON.stringify(state.wishlist)); }

// =========================================
// DADOS MOCK (fallback quando backend offline)
// =========================================

// Catálogo (MVP): produtos digitais + (opcional) afiliados.
// Regra:
// - type: "digital" => CTA abre WhatsApp
// - type: "affiliate" => CTA abre affiliateUrl
const mockCategories = [
  { id: 1, name: 'Templates', icon: 'laptop' },
  { id: 2, name: 'UI Kits', icon: 'settings' },
  { id: 3, name: 'E-commerce', icon: 'gamepad' },
  { id: 4, name: 'Components', icon: 'smartphone' },
  { id: 5, name: 'Docs', icon: 'camera' }
];

const mockProducts = [
  {
    id: 999,
    type: 'service',
    name: 'Serviço sob medida (Solicite orçamento)',
    category: 'Services',
    price: 0,
    oldPrice: 0,
    rating: 5,
    badge: 'CUSTOM',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=900&q=60',
    description: 'Descreva o que você precisa e receba uma cotação por e-mail.'
  },
  {
    id: 101,
    type: 'digital',
    name: 'Landing Page Template',
    category: 'Templates',
    description: 'Modern and responsive landing page template with animations and premium design.',
    price: 299,
    originalPrice: null,
    rating: 4.9,
    reviews: 182,
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=600&fit=crop',
    badge: 'BEST SELLER'
  },
  {
    id: 102,
    type: 'digital',
    name: 'Admin Dashboard UI Kit',
    category: 'UI Kits',
    description: 'Complete dashboard interface with charts, tables, and 50+ components ready to use.',
    price: 599,
    originalPrice: null,
    rating: 4.8,
    reviews: 96,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=600&fit=crop',
    badge: 'PREMIUM'
  },
  {
    id: 103,
    type: 'digital',
    name: 'E-commerce Frontend',
    category: 'E-commerce',
    description: 'Complete e-commerce interface with shopping cart, checkout, and product pages.',
    price: 799,
    originalPrice: null,
    rating: 4.9,
    reviews: 71,
    image: 'https://images.unsplash.com/photo-1519337265831-281ec6cc8514?w=600&h=600&fit=crop',
    badge: null
  },
  {
    id: 104,
    type: 'digital',
    name: 'React Component Library',
    category: 'Components',
    description: '50+ reusable React components with TypeScript support and documentation.',
    price: 399,
    originalPrice: null,
    rating: 4.7,
    reviews: 54,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=600&fit=crop',
    badge: null
  },
  {
    id: 105,
    type: 'digital',
    name: 'Portfolio Template',
    category: 'Templates',
    description: 'Elegant portfolio template perfect for designers and developers to showcase work.',
    price: 249,
    originalPrice: null,
    rating: 4.6,
    reviews: 38,
    image: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=600&h=600&fit=crop',
    badge: 'NEW'
  },
  {
    id: 106,
    type: 'digital',
    name: 'Documentation Template',
    category: 'Docs',
    description: 'Clean documentation template with search, sidebar navigation, and dark mode.',
    price: 199,
    originalPrice: null,
    rating: 4.7,
    reviews: 44,
    image: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=600&h=600&fit=crop',
    badge: null
  }
];

const mockBanners = [
  {
    id: 1,
    tag: 'DIGITAL SHOP',
    title: 'Templates Premium',
    text: 'Layouts modernos para lançar seu produto rápido.',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&h=400&fit=crop',
    theme: 'green'
  },
  {
    id: 2,
    tag: 'UI KITS',
    title: 'Dashboard Components',
    text: 'Componentes prontos para acelerar projetos.',
    image: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=400&h=400&fit=crop',
    theme: 'dark'
  },
  {
    id: 3,
    tag: 'START TODAY',
    title: 'E-commerce Frontend',
    text: 'Interface completa pronta para integrar com backend.',
    image: 'https://images.unsplash.com/photo-1557825835-70d97c4aa567?w=400&h=400&fit=crop',
    theme: 'teal'
  }
];

// =========================================
// I18N (PT/EN/ES) - tradução automática básica
// =========================================
const I18N = {
  en: {
    top_free_shipping: 'Free shipping worldwide. Orders over $100',
    nav_home: 'Home',
    nav_shop: 'Shop',
    nav_pages: 'Pages',
    nav_blog: 'Blog',
    nav_contact: 'Contact Us',
    nav_products: 'Products',
    nav_deals: 'Deals',
    dept_btn: 'Shop by Department',
    products_title: 'Products',
    filter_all: 'All',
    search_placeholder: 'Search for Products...',
    deals_title: "Today's Featured Deals",
    deals_end_in: 'End in:',
    trending_title: 'Trending This Week',
    view_all: 'View All',
    hero_btn: 'View products',
    footer_quick: 'Quick Links',
    footer_customer: 'Customer Service',
    footer_contact: 'Contact Info',
    link_about: 'About Us',
    link_contact: 'Contact',
    link_faqs: 'FAQs',
    link_terms: 'Terms & Conditions',
    link_account: 'My Account',
    link_orders: 'Order History',
    link_wishlist: 'Wishlist',
    link_returns: 'Returns',
    modal_help: 'Optional. Fill in to speed up support. We will open WhatsApp with a ready message.',
    modal_cancel: 'Cancel',
    modal_continue: 'Continue on WhatsApp',
    contact_title: 'Need help or want to buy a digital product?',
    contact_subtitle: "Click below and we'll open WhatsApp with a ready message.",
    contact_btn: 'Contact on WhatsApp',
    footer_desc: 'Premium digital products. Purchase via WhatsApp.',
    footer_back: 'Back to BitStream'
  },
  pt: {
    top_free_shipping: 'Frete grátis mundial. Pedidos acima de $100',
    nav_home: 'Home',
    nav_shop: 'Shop',
    nav_pages: 'Páginas',
    nav_blog: 'Blog',
    nav_contact: 'Contato',
    nav_products: 'Produtos',
    nav_deals: 'Ofertas',
    dept_btn: 'Comprar por Categoria',
    products_title: 'Produtos',
    filter_all: 'Todos',
    search_placeholder: 'Buscar produtos...',
    deals_title: 'Ofertas em Destaque',
    deals_end_in: 'Termina em:',
    trending_title: 'Em Alta na Semana',
    view_all: 'Ver tudo',
    hero_btn: 'Ver produtos',
    footer_quick: 'Links Rápidos',
    footer_customer: 'Atendimento',
    footer_contact: 'Contato',
    link_about: 'Sobre Nós',
    link_contact: 'Contato',
    link_faqs: 'Perguntas Frequentes',
    link_terms: 'Termos & Condições',
    link_account: 'Minha Conta',
    link_orders: 'Histórico de Pedidos',
    link_wishlist: 'Favoritos',
    link_returns: 'Devoluções',
    modal_help: 'Opcional. Preencha para agilizar o atendimento. Vamos abrir o WhatsApp com a mensagem pronta.',
    modal_cancel: 'Cancelar',
    modal_continue: 'Continuar no WhatsApp',
    contact_title: 'Precisa de ajuda ou quer comprar um produto digital?',
    contact_subtitle: 'Clique abaixo e vamos abrir o WhatsApp com uma mensagem pronta.',
    contact_btn: 'Falar no WhatsApp',
    footer_desc: 'Produtos digitais premium. Compra via WhatsApp.',
    footer_back: 'Voltar para o site BitStream'
  },
  es: {
    top_free_shipping: 'Envío gratis a todo el mundo. Pedidos superiores a $100',
    nav_home: 'Inicio',
    nav_shop: 'Tienda',
    nav_pages: 'Páginas',
    nav_blog: 'Blog',
    nav_contact: 'Contacto',
    nav_products: 'Productos',
    nav_deals: 'Ofertas',
    dept_btn: 'Comprar por Categoría',
    products_title: 'Productos',
    filter_all: 'Todo',
    search_placeholder: 'Buscar productos...',
    deals_title: 'Ofertas Destacadas',
    deals_end_in: 'Termina en:',
    trending_title: 'Tendencias de la Semana',
    view_all: 'Ver todo',
    hero_btn: 'Ver productos',
    footer_quick: 'Enlaces Rápidos',
    footer_customer: 'Atención al Cliente',
    footer_contact: 'Contacto',
    link_about: 'Sobre Nosotros',
    link_contact: 'Contacto',
    link_faqs: 'Preguntas Frecuentes',
    link_terms: 'Términos y Condiciones',
    link_account: 'Mi Cuenta',
    link_orders: 'Historial de Pedidos',
    link_wishlist: 'Favoritos',
    link_returns: 'Devoluciones',
    modal_help: 'Opcional. Completa para agilizar. Abriremos WhatsApp con el mensaje listo.',
    modal_cancel: 'Cancelar',
    modal_continue: 'Continuar en WhatsApp',
    contact_title: '¿Necesitas ayuda o quieres comprar un producto digital?',
    contact_subtitle: 'Haz clic abajo y abriremos WhatsApp con un mensaje listo.',
    contact_btn: 'Hablar por WhatsApp',
    footer_desc: 'Productos digitales premium. Compra por WhatsApp.',
    footer_back: 'Volver a BitStream'
  }
};

function getLang() {
  return (localStorage.getItem('bs_shop_lang') || 'pt').toLowerCase();
}

function setLang(lang) {
  localStorage.setItem('bs_shop_lang', lang);
}

function t(key) {
  const lang = getLang();
  return (I18N[lang] && I18N[lang][key]) || (I18N.en && I18N.en[key]) || key;
}

function applyTranslations() {
  // Text nodes
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  // Placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.setAttribute('placeholder', t(key));
  });
}

function initLanguage() {
  const langSelect = document.getElementById('langSelect');
  if (!langSelect) return;

  // Set current
  const current = getLang();
  langSelect.value = current;

  applyTranslations();

  langSelect.addEventListener('change', () => {
    const lang = (langSelect.value || 'pt').toLowerCase();
    setLang(lang);
    applyTranslations();
    // Re-render dynamic parts that depend on language
    renderBanners(mockBanners);
  });
}

// =========================================
// API FUNCTIONS (com fallback para mocks)
// =========================================

async function fetchData(endpoint, fallbackData) {
  // Conectar no Node + SQLite depois
  if (BASE_URL) {
    try {
      const response = await fetch(BASE_URL + endpoint);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn(`API offline, usando mock para ${endpoint}`);
    }
  }
  return fallbackData;
}

async function getProducts() {
  return fetchData('/api/products', mockProducts);
}

async function getCategories() {
  return fetchData('/api/categories', mockCategories);
}

async function getDeals() {
  return fetchData('/api/deals', mockProducts.slice(0, 6));
}

async function getTrending(tab = 'best') {
  return fetchData(`/api/trending?tab=${tab}`, mockProducts);
}

async function addToCartAPI(productId, qty) {
  // Conectar no Node + SQLite depois
  if (BASE_URL) {
    try {
      const response = await fetch(BASE_URL + '/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, qty })
      });
      if (response.ok) return await response.json();
    } catch (error) {
      console.warn('API offline, usando cart local');
    }
  }
  return null;
}

async function toggleWishlistAPI(productId) {
  // Conectar no Node + SQLite depois
  if (BASE_URL) {
    try {
      const response = await fetch(BASE_URL + '/api/wishlist/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });
      if (response.ok) return await response.json();
    } catch (error) {
      console.warn('API offline, usando wishlist local');
    }
  }
  return null;
}

// =========================================
// FUNÇÕES DE RENDERIZAÇÃO
// =========================================

function getCategoryIcon(iconName) {
  const icons = {
    laptop: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
      <line x1="2" y1="20" x2="22" y2="20"></line>
    </svg>`,
    camera: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
      <circle cx="12" cy="13" r="4"></circle>
    </svg>`,
    tv: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
      <polyline points="17 2 12 7 7 2"></polyline>
    </svg>`,
    watch: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="7"></circle>
      <polyline points="12 9 12 12 13.5 13.5"></polyline>
      <path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83"></path>
    </svg>`,
    gamepad: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="6" y1="12" x2="10" y2="12"></line>
      <line x1="8" y1="10" x2="8" y2="14"></line>
      <line x1="15" y1="13" x2="15.01" y2="13"></line>
      <line x1="18" y1="11" x2="18.01" y2="11"></line>
      <rect x="2" y="6" width="20" height="12" rx="2"></rect>
    </svg>`,
    smartphone: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
      <line x1="12" y1="18" x2="12.01" y2="18"></line>
    </svg>`,
    headphones: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
    </svg>`,
    settings: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>`
  };
  return icons[iconName] || icons.settings;
}

function renderCategories(categories) {
  const wrapper = document.getElementById('categoriesWrapper');
  if (!wrapper) return;
  
  wrapper.innerHTML = categories.map((cat, index) => `
    <div class="category-item ${index === 4 ? 'active' : ''}" data-category="${cat.id}">
      <div class="category-icon">
        ${getCategoryIcon(cat.icon)}
      </div>
      <span class="category-name">${cat.name}</span>
    </div>
  `).join('');
}

function renderBanners(banners) {
  const grid = document.getElementById('bannersGrid');
  if (!grid) return;
  
  grid.innerHTML = banners.map(banner => `
    <div class="promo-banner promo-banner-${banner.theme}">
      <span class="promo-banner-tag">${banner.tag}</span>
      <h3 class="promo-banner-title">${banner.title}</h3>
      <p class="promo-banner-text">${banner.text}</p>
      <a href="#" class="promo-banner-btn">
        Shop Now
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </a>
      <img src="${banner.image}" alt="${banner.title}" class="promo-banner-img">
    </div>
  `).join('');
}

function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  let stars = '';
  
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars += `<svg class="star" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>`;
    } else {
      stars += `<svg class="star empty" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>`;
    }
  }
  return stars;
}

function formatBRL(value) {
  try {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  } catch {
    return `R$ ${Number(value).toFixed(2)}`;
  }
}

function buildWhatsAppMessage(product, customer) {
  const lines = [];
  lines.push('Olá! Quero comprar um produto digital.');
  lines.push('');
  lines.push(`Produto: ${product.name}`);
  lines.push(`Preço: ${formatBRL(product.price)}`);
  if (customer?.name) lines.push(`Nome: ${customer.name}`);
  if (customer?.email) lines.push(`Email: ${customer.email}`);
  lines.push('');
  lines.push('Pode me enviar as formas de pagamento e o acesso, por favor?');
  return lines.join('\n');
}

function renderProductCard(product, featured = false) {
  const isInWishlist = state.wishlist.includes(product.id);

  const cta = (() => {
    if (product.type === 'affiliate' && product.affiliateUrl) {
      return `<a class="add-to-cart-btn buy-affiliate-btn" href="${product.affiliateUrl}" target="_blank" rel="noopener">Comprar no parceiro</a>`;
    }
    if (product.type === 'digital') {
      return `<button class="add-to-cart-btn buy-whatsapp-btn" data-buy-whatsapp="${product.id}">Comprar no WhatsApp</button>`;
    }
    return `<button class="add-to-cart-btn" data-add-cart="${product.id}">+ Add</button>`;
  })();
  
  return `
    <div class="product-card ${featured ? 'featured' : ''}" data-product-id="${product.id}">
      <div class="product-card-image">
        ${product.badge ? `<span class="product-card-badge">${product.badge}</span>` : ''}
        <button class="product-card-wishlist ${isInWishlist ? 'active' : ''}" data-wishlist="${product.id}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="${isInWishlist ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-card-content">
        <p class="product-card-category">${product.category}</p>
        <h3 class="product-card-title">${product.name}</h3>
        ${product.description ? `<p class="product-card-desc">${product.description}</p>` : ''}
        <div class="product-card-rating">
          <div class="stars">${renderStars(product.rating)}</div>
          <span class="review-count">${product.reviews} Reviews</span>
        </div>
        <div class="product-card-price">
          <span class="price-current">${formatBRL(product.price)}</span>
          ${product.originalPrice ? `<span class="price-original">${formatBRL(product.originalPrice)}</span>` : ''}
        </div>
        <div class="product-card-action">
          <span class="product-card-stock">${product.type === 'digital' ? 'Entrega via WhatsApp' : 'Confira disponibilidade'}</span>
          ${cta}
        </div>
      </div>
    </div>
  `;
}

function renderDeals(products) {
  const track = document.getElementById('dealsTrack');
  if (!track) return;
  
  track.innerHTML = products.map(product => renderProductCard(product)).join('');
  attachProductEvents(track);
}

function renderTrending(products) {
  const grid = document.getElementById('trendingGrid');
  if (!grid) return;
  
  // Criar layout com produto destaque no centro
  const gridProducts = [...products].slice(0, 10);
  let html = '';
  
  gridProducts.forEach((product, index) => {
    // Produto central em destaque (5º produto)
    const isFeatured = index === 4;
    html += renderProductCard(product, isFeatured);
  });
  
  grid.innerHTML = html;
  attachProductEvents(grid);
}

// =========================================
// PRODUCTS GRID (Single Page Catalog)
// =========================================

function renderProductsGrid(products) {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  grid.innerHTML = products.map(p => renderProductCard(p, false)).join('');
  attachProductEvents(grid);
}

function applyProductsFilter(products) {
  if (!state.productsFilter || state.productsFilter === 'all') return products;
  const want = String(state.productsFilter).toLowerCase();
  return products.filter(p => String(p.category || '').toLowerCase() === want);
}

function initProductFilters() {
  const filters = document.getElementById('productFilters');
  if (!filters) return;

  const buttons = Array.from(filters.querySelectorAll('[data-filter]'));
  const setActive = (filter) => {
    state.productsFilter = filter || 'all';
    buttons.forEach(b => b.classList.toggle('active', b.dataset.filter === state.productsFilter));
  };

  const apply = () => {
    const filtered = applyProductsFilter(state.products);
    renderProductsGrid(filtered);
  };

  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      setActive(btn.dataset.filter);
      apply();
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // initial
  setActive('all');
}

function attachProductEvents(container) {
  // Wishlist toggle
  container.querySelectorAll('[data-wishlist]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const productId = parseInt(btn.dataset.wishlist);
      toggleWishlist(productId);
    });
  });
  
  // Add to cart
  container.querySelectorAll('[data-add-cart]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const productId = parseInt(btn.dataset.addCart);
      addToCart(productId);
    });
  });

  // Buy via WhatsApp (digital)
  container.querySelectorAll('[data-buy-whatsapp]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const productId = parseInt(btn.dataset.buyWhatsapp);
      openPurchaseModal(productId);
    });
  });
}

// =========================================
// WHATSAPP CHECKOUT (SEM BACKEND)
// =========================================

let pendingPurchaseProductId = null;

function openPurchaseModal(productId) {
  pendingPurchaseProductId = productId;
  const modal = document.getElementById('purchaseModal');
  const title = document.getElementById('purchaseModalTitle');
  const price = document.getElementById('purchaseModalPrice');
  const desc = document.getElementById('purchaseModalDesc');

  const product = state.products.find(p => p.id === productId);
  if (!product || !modal) return;

  if (title) title.textContent = product.name;
  if (price) price.textContent = formatBRL(product.price);
  if (desc) desc.textContent = product.description || '';

  // reset inputs
  const nameInput = document.getElementById('purchaseName');
  const emailInput = document.getElementById('purchaseEmail');
  if (nameInput) nameInput.value = '';
  if (emailInput) emailInput.value = '';

  modal.classList.add('open');
  document.body.classList.add('modal-open');
}

function closePurchaseModal() {
  const modal = document.getElementById('purchaseModal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.classList.remove('modal-open');
  pendingPurchaseProductId = null;
}

function startWhatsAppPurchase() {
  const product = state.products.find(p => p.id === pendingPurchaseProductId);
  if (!product) return;

  const name = (document.getElementById('purchaseName')?.value || '').trim();
  const email = (document.getElementById('purchaseEmail')?.value || '').trim();

  const msg = buildWhatsAppMessage(product, { name, email });
  const url = `${WHATSAPP_BASE}${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank', 'noopener');
  closePurchaseModal();
}

// =========================================
// FUNÇÕES DO CARRINHO E WISHLIST
// =========================================

function addToCart(productId) {
  const existingItem = state.cart.find(item => item.productId === productId);
  
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    state.cart.push({ productId, qty: 1 });
  }
  
  updateCartBadge();
  persistCart();
  addToCartAPI(productId, 1);
  
  // Feedback visual
  showNotification('Adicionado ao carrinho!');
}

function toggleWishlist(productId) {
  const index = state.wishlist.indexOf(productId);
  
  if (index > -1) {
    state.wishlist.splice(index, 1);
  } else {
    state.wishlist.push(productId);
  }
  
  updateWishlistBadge();
  persistWishlist();
  toggleWishlistAPI(productId);
  
  // Atualizar visual do botão
  document.querySelectorAll(`[data-wishlist="${productId}"]`).forEach(btn => {
    btn.classList.toggle('active');
    const svg = btn.querySelector('svg');
    if (svg) {
      svg.setAttribute('fill', state.wishlist.includes(productId) ? 'currentColor' : 'none');
    }
  });
}

function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  const total = state.cart.reduce((sum, item) => sum + item.qty, 0);
  if (badge) badge.textContent = total;
  
  // Atualizar total
  const cartTotal = document.querySelector('.cart-total span');
  if (cartTotal) {
    const totalPrice = state.cart.reduce((sum, item) => {
      const product = state.products.find(p => p.id === item.productId);
      return sum + (product ? product.price * item.qty : 0);
    }, 0);
    cartTotal.textContent = formatBRL(totalPrice);
  }
}

function updateWishlistBadge() {
  const badge = document.getElementById('wishlistBadge');
  if (badge) badge.textContent = state.wishlist.length;
}

function showNotification(message) {
  // Criar notificação simples
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #2563eb;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 500;
    z-index: 9999;
    animation: slideIn 0.3s ease;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

function initPurchaseModal() {
  const modal = document.getElementById('purchaseModal');
  if (!modal) return;

  const closeBtn = document.getElementById('purchaseModalClose');
  const cancelBtn = document.getElementById('purchaseModalCancel');
  const form = document.getElementById('purchaseForm');

  closeBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    closePurchaseModal();
  });
  cancelBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    closePurchaseModal();
  });

  // Fechar clicando no backdrop
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closePurchaseModal();
  });

  // ESC fecha
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closePurchaseModal();
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    startWhatsAppPurchase();
  });
}

// =========================================
// COUNTDOWN TIMER
// =========================================

function initCountdown() {
  // Data alvo: 7 dias a partir de agora
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 7);
  
  function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now;
    
    if (diff <= 0) {
      return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    const daysEl = document.getElementById('countdownDays');
    const hoursEl = document.getElementById('countdownHours');
    const minutesEl = document.getElementById('countdownMinutes');
    const secondsEl = document.getElementById('countdownSeconds');
    
    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }
  
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// =========================================
// BUSCA E FILTROS
// =========================================

function initSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const categorySelect = document.querySelector('.search-category');

  if (!searchInput || !searchBtn) return;

  function applyQueryFilter(products, query) {
    const q = query.toLowerCase().trim();
    if (!q) return products;
    return products.filter(p =>
      String(p.name || '').toLowerCase().includes(q) ||
      String(p.category || '').toLowerCase().includes(q) ||
      String(p.description || '').toLowerCase().includes(q)
    );
  }

  function applyCategorySelect(products) {
    if (!categorySelect) return products;
    const value = String(categorySelect.value || '').trim();
    if (!value || value === 'All Categories') return products;
    return products.filter(p => String(p.category || '').toLowerCase() === value.toLowerCase());
  }

  function performSearch() {
    const query = searchInput.value;

    // Home sections
    const homeFiltered = applyCategorySelect(applyQueryFilter(state.products, query));
    const deals = homeFiltered.slice(0, 6);

    // Render home if present
    if (document.getElementById('dealsTrack')) renderDeals(deals);
    if (document.getElementById('trendingGrid')) renderTrending(homeFiltered);

    // Render single-page products grid (if present)
    if (document.getElementById('productsGrid')) {
      const filtered = applyProductsFilter(homeFiltered);
      renderProductsGrid(filtered);
    }

    // Render shop page grid if present
    if (document.getElementById('shopGrid')) {
      const paramsFiltered = applyShopFilters(state.products);
      const finalFiltered = applyCategorySelect(applyQueryFilter(paramsFiltered, query));
      renderShopGrid(finalFiltered);
    }
  }

  searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    performSearch();
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch();
    }
  });

  categorySelect?.addEventListener('change', () => performSearch());
}

// =========================================
// TABS
// =========================================

function initTabs() {
  const tabsContainer = document.getElementById('trendingTabs');
  if (!tabsContainer) return;
  
  tabsContainer.querySelectorAll('.trending-tab').forEach(tab => {
    tab.addEventListener('click', async () => {
      // Remover active de todos
      tabsContainer.querySelectorAll('.trending-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      state.currentTab = tab.dataset.tab;
      
      // Simular diferentes ordenações
      let sorted = [...state.products];
      
      switch (state.currentTab) {
        case 'sale':
          sorted = sorted.filter(p => p.originalPrice > p.price);
          break;
        case 'new':
          sorted = sorted.filter(p => String(p.badge || '').toUpperCase().includes('NEW') || String(p.badge || '').toUpperCase().includes('HOT'));
          break;
        case 'featured':
          sorted = sorted.filter(p => p.rating >= 4.7);
          break;
        default:
          sorted = sorted.sort((a, b) => b.reviews - a.reviews);
      }
      
      renderTrending(sorted);
    });
  });
}

// =========================================
// MOBILE MENU
// =========================================

function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('mobileMenu');
  const closeBtn = document.getElementById('mobileMenuClose');

  if (!menuBtn || !menu || !closeBtn) return;

  // overlay
  let overlay = document.querySelector('.mobile-menu-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    document.body.appendChild(overlay);
  }

  const open = () => {
    menu.classList.add('active');
    overlay.classList.add('active');
    document.body.classList.add('menu-open');
  };

  const close = () => {
    menu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.classList.remove('menu-open');
  };

  menuBtn.addEventListener('click', (e) => {
    e.preventDefault();
    open();
  });

  closeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    close();
  });

  overlay.addEventListener('click', close);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}

// =========================================
// SLIDER DOS DEALS
// =========================================

function initDealsSlider() {
  const track = document.getElementById('dealsTrack');
  const prevBtn = document.getElementById('dealsPrev');
  const nextBtn = document.getElementById('dealsNext');
  
  if (!track || !prevBtn || !nextBtn) return;
  
  const scrollAmount = 250;
  
  prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });
  
  nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });
}

// =========================================
// CONTACT PAGE (sem backend) -> WhatsApp
// =========================================
function initContactPage() {
  const btn = document.getElementById('contactWhatsApp');
  const form = document.getElementById('contactForm');
  const open = (msg) => {
    const url = `${WHATSAPP_BASE}${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener');
  };

  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      open('Olá! Quero falar com a BitStream.\n\nAssunto: ');
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (document.getElementById('cName')?.value || '').trim();
      const email = (document.getElementById('cEmail')?.value || '').trim();
      const message = (document.getElementById('cMsg')?.value || '').trim();

      const lines = [
        'Olá! Quero falar com a BitStream.',
        '',
        name ? `Nome: ${name}` : null,
        email ? `Email: ${email}` : null,
        message ? `Mensagem: ${message}` : null
      ].filter(Boolean);

      open(lines.join('\n'));
    });
  }
}

// =========================================
// WISHLIST PAGE (render)
// =========================================
function renderWishlistPage() {
  const grid = document.getElementById('wishlistGrid');
  if (!grid) return;

  const items = state.products.filter(p => state.wishlist.includes(p.id));
  if (!items.length) {
    grid.innerHTML = `<div class="page-card" style="grid-column:1 / -1;">
      <p style="margin:0; font-weight:800;">Sua wishlist está vazia</p>
      <p style="margin:6px 0 0; color:var(--muted); font-weight:500;">Adicione produtos clicando no coração.</p>
    </div>`;
    return;
  }

  grid.innerHTML = items.map(p => renderProductCard(p, false)).join('');
  attachProductEvents(grid);
}

// =========================================
// INICIALIZAÇÃO
// =========================================

// =========================================
// HERO CAROUSEL (Home)
// =========================================
function initHeroCarousel() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const subtitleEl = document.getElementById('heroSubtitle');
  const titleEl = document.getElementById('heroTitle');
  const priceEl = document.getElementById('heroPrice');
  const imgEl = document.getElementById('heroImage');
  const ctaEl = document.getElementById('heroCta');
  const prevBtn = document.getElementById('heroPrev');
  const nextBtn = document.getElementById('heroNext');
  const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));

  const slides = [
    {
      subtitle: 'DIGITAL SHOP',
      titleHtml: 'Premium Digital<br><span>Products & Templates</span>',
      price: 'R$ 199',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&h=650&fit=crop',
      ctaText: 'Ver produtos',
      ctaHref: '#products'
    },
    {
      subtitle: 'BEST SELLER',
      titleHtml: 'Landing Page<br><span>Template</span>',
      price: 'R$ 299',
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&h=650&fit=crop',
      ctaText: 'Comprar no WhatsApp',
      ctaHref: '#products',
      buyProductId: 101
    },
    {
      subtitle: 'PREMIUM',
      titleHtml: 'Admin Dashboard<br><span>UI Kit</span>',
      price: 'R$ 599',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=650&fit=crop',
      ctaText: 'Ver detalhes',
      ctaHref: '#products',
      buyProductId: 102
    }
  ];

  let idx = 0;
  let timer = null;

  const apply = (i) => {
    idx = (i + slides.length) % slides.length;
    const s = slides[idx];

    if (subtitleEl) subtitleEl.textContent = s.subtitle;
    if (titleEl) titleEl.innerHTML = s.titleHtml;
    if (priceEl) priceEl.textContent = s.price;
    if (imgEl) {
      imgEl.style.opacity = '0.0';
      setTimeout(() => {
        imgEl.src = s.image;
        imgEl.onload = () => (imgEl.style.opacity = '1');
        imgEl.style.opacity = '1';
      }, 120);
    }
    if (ctaEl) {
      ctaEl.textContent = s.ctaText;
      ctaEl.href = s.ctaHref;
      if (s.buyProductId) ctaEl.dataset.heroBuy = String(s.buyProductId);
      else delete ctaEl.dataset.heroBuy;
    }
    dots.forEach(d => d.classList.remove('active'));
    const activeDot = dots[idx];
    if (activeDot) activeDot.classList.add('active');
  };

  const start = () => {
    stop();
    timer = setInterval(() => apply(idx + 1), 6000);
  };
  const stop = () => timer && clearInterval(timer);

  prevBtn?.addEventListener('click', () => { apply(idx - 1); start(); });
  nextBtn?.addEventListener('click', () => { apply(idx + 1); start(); });

  // CTA behavior: scroll to products or open WhatsApp purchase modal
  ctaEl?.addEventListener('click', (e) => {
    const buyId = Number(ctaEl.dataset.heroBuy || 0);
    if (buyId) {
      e.preventDefault();
      openPurchaseModal(buyId);
      return;
    }
    // allow default anchor behavior, but ensure smooth scroll
    const target = document.getElementById('products');
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // Swipe (mobile)
  let x0 = null;
  hero.addEventListener('touchstart', (e) => {
    x0 = e.touches && e.touches[0] ? e.touches[0].clientX : null;
  }, { passive: true });
  hero.addEventListener('touchend', (e) => {
    if (x0 == null) return;
    const x1 = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : null;
    if (x1 == null) return;
    const dx = x1 - x0;
    if (Math.abs(dx) > 40) {
      apply(idx + (dx < 0 ? 1 : -1));
      start();
    }
    x0 = null;
  }, { passive: true });

  dots.forEach((d) => {
    d.addEventListener('click', () => {
      const i = parseInt(d.dataset.heroDot, 10);
      if (!Number.isNaN(i)) { apply(i); start(); }
    });
  });

  // Pause on hover (desktop)
  hero.addEventListener('mouseenter', stop);
  hero.addEventListener('mouseleave', start);

  apply(0);
  start();
}

// =========================================
// DEPARTMENT DROPDOWN
// =========================================
function initDepartmentMenu() {
  const btn = document.querySelector('.department-btn');
  const menu = document.getElementById('departmentMenu');
  if (!btn || !menu) return;

  const toggle = (open) => {
    const shouldOpen = (typeof open === 'boolean') ? open : !menu.classList.contains('show');
    menu.classList.toggle('show', shouldOpen);
  };

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle();
  });

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !btn.contains(e.target)) toggle(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggle(false);
  });

  // Single page: filtra produtos ao escolher uma categoria
  menu.querySelectorAll('[data-dept]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const dept = link.dataset.dept || 'all';
      const filters = document.getElementById('productFilters');
      const btnMatch = filters?.querySelector(`[data-filter="${CSS.escape(dept)}"]`);
      // aciona a mesma lógica dos botões, se existir
      if (btnMatch) btnMatch.click();
      else {
        state.productsFilter = dept;
        renderProductsGrid(applyProductsFilter(state.products));
        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      toggle(false);
    });
  });
}

// =========================================
// SHOP PAGE GRID
// =========================================
function renderShopGrid(products) {
  const grid = document.getElementById('shopGrid');
  if (!grid) return;

  grid.innerHTML = products.map(p => renderProductCard(p, false)).join('');
  attachProductEvents(grid);
}

function applyShopFilters(products) {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('category');
  const highlight = params.get('highlight');

  let filtered = [...products];
  if (cat) {
    const normalized = decodeURIComponent(cat).toLowerCase();
    filtered = filtered.filter(p => String(p.category || '').toLowerCase() === normalized);
  }

  // highlight scroll
  setTimeout(() => {
    if (highlight) {
      const card = document.querySelector(`[data-product-id="${highlight}"]`);
      card?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card?.classList.add('highlight');
      setTimeout(() => card?.classList.remove('highlight'), 2000);
    }
  }, 250);

  return filtered;
}

function initCategoriesNavigation() {
  const wrapper = document.getElementById('categoriesWrapper');
  if (!wrapper) return;

  wrapper.addEventListener('click', (e) => {
    const item = e.target.closest('.category-item');
    if (!item) return;
    const name = item.querySelector('.category-name')?.textContent?.trim();
    if (!name) return;
    // Single page: filtrar no catálogo e rolar até a seção
    const filters = document.getElementById('productFilters');
    const btnMatch = filters?.querySelector(`[data-filter="${CSS.escape(name)}"]`);
    if (btnMatch) btnMatch.click();
    else {
      state.productsFilter = name;
      renderProductsGrid(applyProductsFilter(state.products));
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

async function init() {
  loadPersistedState();
  // Carregar dados
  state.categories = await getCategories();
  state.products = await getProducts();
  state.deals = state.products.slice(0, 6);
  state.trending = state.products;
  
  // Renderizar
  renderCategories(state.categories);
  renderBanners(mockBanners);
  renderDeals(state.deals);
  renderTrending(state.trending);
  renderProductsGrid(applyProductsFilter(state.products));

  // Shop page rendering (grid full)
  if (document.getElementById('shopGrid')) {
    const filtered = applyShopFilters(state.products);
    renderShopGrid(filtered);
  }
  
  // Inicializar funcionalidades
  initCountdown();
  initSearch();
  initLanguage();
  initProductFilters();
  initTabs();
  initMobileMenu();
    initHeroCarousel();
  initDepartmentMenu();
  initCategoriesNavigation();
  initDealsSlider();
  initPurchaseModal();
  initContactPage();
  renderWishlistPage();
  
  // Atualizar badges
  updateCartBadge();
  updateWishlistBadge();
}

// Adicionar estilos de animação
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);

// Executar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', init);

// --- Service Request (Email) ---
(function(){
  const modal = document.getElementById("serviceModal");
  if(!modal) return;

  const open = () => {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden","false");
    document.body.classList.add("no-scroll");
    setTimeout(()=>document.getElementById("serviceDesc")?.focus(), 50);
  };

  const close = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden","true");
    document.body.classList.remove("no-scroll");
  };

  // Hook: any button/link with data-action="service"
  document.addEventListener("click", (e)=>{
    const t = e.target.closest("[data-action='service']");
    if(t){
      e.preventDefault();
      open();
    }
    const c = e.target.closest("[data-close='service']");
    if(c){
      e.preventDefault();
      close();
    }
  });

  document.addEventListener("keydown", (e)=>{
    if(e.key === "Escape" && modal.classList.contains("is-open")) close();
  });

  const sendBtn = document.getElementById("serviceSendBtn");
  const toEmail = "contato.bitstream@gmail.com"; // troque se quiser
  sendBtn?.addEventListener("click", ()=>{
    const name = (document.getElementById("serviceName").value || "").trim();
    const email = (document.getElementById("serviceEmail").value || "").trim();
    const desc = (document.getElementById("serviceDesc").value || "").trim();

    const subject = encodeURIComponent("Pedido de orçamento - BitStream Shop");
    const body = encodeURIComponent(
      `Olá BitStream,\n\nQuero um orçamento para o seguinte serviço:\n\n${desc}\n\n` +
      (name ? `Nome: ${name}\n` : "") +
      (email ? `E-mail: ${email}\n` : "") +
      `\nEnviado via BitStream Shop.`
    );

    // mailto open
    window.location.href = `mailto:${toEmail}?subject=${subject}&body=${body}`;
    close();
  });

  // Expose open if needed
  window.__openServiceModal = open;
})();

// Ensure service products open the email modal
document.addEventListener("click", (e)=>{
  const btn = e.target.closest("[data-service-open='1']");
  if(btn){
    e.preventDefault();
    window.__openServiceModal && window.__openServiceModal();
  }
});

(function(){
  const cards = document.querySelectorAll("[data-product-id]");
  cards.forEach(card=>{
    const id = card.getAttribute("data-product-id");
    if(id !== "custom-service") return;
    const btn = card.querySelector("a,button");
    if(!btn) return;
    btn.textContent = "Solicitar orçamento";
    btn.setAttribute("data-service-open","1");
    if(btn.tagName.toLowerCase() === "a") btn.setAttribute("href","#");
  });
})();
