// ===== Multi Línguas - Home =====

document.addEventListener('DOMContentLoaded', () => {

  const menuToggle = document.getElementById('menuToggle');
  const navMobile = document.getElementById('navMobile');
  const navLinks = document.querySelectorAll('.nav-link');
  const cards = document.querySelectorAll('.card');
  const toast = document.getElementById('toast');

  // ===== Menu mobile =====
  menuToggle.addEventListener('click', () => {
    navMobile.classList.toggle('open');
    menuToggle.innerHTML = navMobile.classList.contains('open')
      ? '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>'
      : '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
  });

  // ===== Navegação =====
  function ativarAba(tab) {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.tab === tab);
    });

    navMobile.classList.remove('open');
    menuToggle.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';

    const mensagens = {
      home: '🏠 Você já está na página inicial!',
      traducao: '🔤 Abrindo Tradução em Tempo Real...',
      chat: '💬 Abrindo Chat com Tradução...',
      dicionario: '📖 Abrindo Meu Dicionário...',
      progresso: '📊 Abrindo Meu Progresso...',
      relatorios: '📋 Abrindo Relatórios Escolares...',
      vip: '⭐ Abrindo Planos VIP...'
    };

    mostrarToast(mensagens[tab] || 'Navegando...');

    // Redirecionamento real:
    // window.location.href = `/${tab}.html`;
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      ativarAba(link.dataset.tab);
    });
  });

  cards.forEach(card => {
    card.addEventListener('click', () => {
      ativarAba(card.dataset.tab);
    });
  });

  // ===== Botões =====
  document.getElementById('btnComecar').addEventListener('click', () => {
    mostrarToast('🚀 Vamos começar! Faça sua pré-avaliação.');
    // window.location.href = '/pre-avaliacao.html';
  });

  document.getElementById('btnSaibaMais').addEventListener('click', () => {
    document.querySelector('.quick-access').scrollIntoView({ behavior: 'smooth' });
    mostrarToast('📚 Conheça nossos recursos!');
  });

  document.getElementById('btnContinuar').addEventListener('click', () => {
    mostrarToast('📖 Retomando seus estudos...');
    // window.location.href = '/modulo.html';
  });

  document.getElementById('btnVip').addEventListener('click', () => ativarAba('vip'));

  document.getElementById('btnProfile').addEventListener('click', () => {
    mostrarToast('👤 Abrindo seu perfil...');
    // window.location.href = '/perfil.html';
  });

  // ===== Toast =====
  let toastTimeout;
  function mostrarToast(mensagem) {
    clearTimeout(toastTimeout);
    toast.textContent = mensagem;
    toast.classList.add('show');

    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  // ===== ESC fecha menu =====
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      navMobile.classList.remove('open');
      menuToggle.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
    }
  });

  // ===== Animação de entrada =====
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `opacity 0.5s ease ${index * 0.06}s, transform 0.5s ease ${index * 0.06}s, box-shadow 0.28s ease, border-color 0.28s ease`;
    observer.observe(card);
  });

});