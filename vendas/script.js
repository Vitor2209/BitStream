// ===================================
// SCROLL SUAVE PARA #CHECKOUT
// ===================================
document.querySelectorAll('a[href="#checkout"]').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.getElementById('checkout');
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  });
});

// ===================================
// BOTÃO FLUTUANTE
// ===================================
const floatingBtn = document.getElementById('floatingBtn');

function checkScrollPosition() {
  const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  
  if (scrollPercent > 25) {
    floatingBtn.classList.add('visible');
  } else {
    floatingBtn.classList.remove('visible');
  }
}

window.addEventListener('scroll', checkScrollPosition);
checkScrollPosition();

floatingBtn.addEventListener('click', function() {
  const target = document.getElementById('checkout');
  if (target) {
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }
});

// ===================================
// ANIMAÇÕES ON-SCROLL (REVEAL)
// ===================================
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => {
  revealObserver.observe(el);
});

// ===================================
// ANIMAÇÃO INICIAL (HERO)
// ===================================
document.addEventListener('DOMContentLoaded', function() {
  // Adiciona classe visible ao hero após um pequeno delay
  setTimeout(() => {
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.classList.add('visible');
    }
  }, 100);
});
