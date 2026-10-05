(function () {
  'use strict';

  const LANGUAGES = window.LANGUAGES;
  const MAX_LANGS = window.MAX_LANGS;

  /* ----------------------------------------------------------------------
     REFERÊNCIAS DOM
     ---------------------------------------------------------------------- */
  const form        = document.getElementById('loginForm');
  const emailInput  = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');
  const emailError  = document.getElementById('loginEmailError');
  const passwordError = document.getElementById('loginPasswordError');
  const submitBtn   = document.getElementById('loginSubmitBtn');
  const toastEl     = document.getElementById('toast');
  const welcome     = document.getElementById('loginWelcome');

  const openLangBtn   = document.getElementById('openLangPicker');
  const langModal     = document.getElementById('langModal');
  const closeLangBtn  = document.getElementById('closeLangModal');
  const cancelLangBtn = document.getElementById('cancelLang');
  const confirmLangBtn= document.getElementById('confirmLang');
  const langSearch    = document.getElementById('langSearch');
  const langList      = document.getElementById('langList');
  const selectedCount = document.getElementById('selectedCount');
  const loginLangCount= document.getElementById('loginLangCount');
  const loginLangPreview = document.getElementById('loginLangPreview');

  /* ----------------------------------------------------------------------
     ESTADO
     ---------------------------------------------------------------------- */
  let userLangs = [];  // idiomas do usuário (vêm do cadastro)
  let tempSelection = [];

  /* ----------------------------------------------------------------------
     TOAST
     ---------------------------------------------------------------------- */
  function showToast(message, icon) {
    toastEl.innerHTML = '<i class="fas ' + (icon || 'fa-info-circle') + '"></i> ' + message;
    toastEl.classList.add('show');
    clearTimeout(toastEl._timer);
    toastEl._timer = setTimeout(function () {
      toastEl.classList.remove('show');
    }, 2600);
  }

  /* ----------------------------------------------------------------------
     CARREGA DADOS DO CADASTRO
     ---------------------------------------------------------------------- */
  function loadUserData() {
    const raw = localStorage.getItem('ml_user');
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }

  function populateFromUser() {
    const user = loadUserData();
    if (!user) return;

    // Preenche e-mail automaticamente
    if (user.email) emailInput.value = user.email;

    // Personaliza a saudação
    if (user.name) welcome.textContent = 'Olá, ' + user.name + '! Que bom te ver de novo.';

    // Converte códigos salvos em objetos de idioma
    if (user.langs && user.langs.length) {
      userLangs = user.langs
        .map(function (code) {
          return LANGUAGES.find(function (l) { return l.code === code; });
        })
        .filter(Boolean);
      updateLangButtonDisplay();
    }
  }

  /* ----------------------------------------------------------------------
     MOSTRAR/ESCONDER SENHA
     ---------------------------------------------------------------------- */
  document.querySelectorAll('.toggle-eye').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const target = document.getElementById(btn.dataset.target);
      const isPwd = target.type === 'password';
      target.type = isPwd ? 'text' : 'password';
      btn.innerHTML = isPwd
        ? '<i class="fas fa-eye-slash"></i>'
        : '<i class="fas fa-eye"></i>';
    });
  });

  /* ----------------------------------------------------------------------
     MODAL DE IDIOMAS (aqui serve para TROCAR os já escolhidos)
     ---------------------------------------------------------------------- */
  function openModal() {
    // Pré-seleciona os idiomas atuais do usuário
    tempSelection = userLangs.slice();
    renderLangList('');
    updateSelectedCount();
    langSearch.value = '';
    langModal.classList.add('open');
    setTimeout(function () { langSearch.focus(); }, 200);
  }

  function closeModal() {
    langModal.classList.remove('open');
  }

  openLangBtn.addEventListener('click', openModal);
  closeLangBtn.addEventListener('click', closeModal);
  cancelLangBtn.addEventListener('click', closeModal);
  langModal.addEventListener('click', function (e) {
    if (e.target === langModal) closeModal();
  });

  function renderLangList(filter) {
    const f = (filter || '').toLowerCase();
    langList.innerHTML = '';

    LANGUAGES
      .filter(function (l) {
        return l.name.toLowerCase().includes(f) || l.code.toLowerCase().includes(f);
      })
      .forEach(function (lang) {
        const li = document.createElement('li');
        const isSelected = tempSelection.some(function (s) { return s.code === lang.code; });
        const isFull = tempSelection.length >= MAX_LANGS;

        li.innerHTML =
          '<span class="flag">' + lang.flag + '</span>' +
          '<span>' + lang.name + '</span>' +
          '<i class="fas fa-check check"></i>';

        if (isSelected) li.classList.add('selected');
        if (!isSelected && isFull) li.classList.add('disabled');

        li.addEventListener('click', function () {
          if (!isSelected && tempSelection.length >= MAX_LANGS) return;
          if (isSelected) {
            tempSelection = tempSelection.filter(function (s) { return s.code !== lang.code; });
          } else {
            tempSelection.push(lang);
          }
          renderLangList(langSearch.value);
          updateSelectedCount();
        });

        langList.appendChild(li);
      });
  }

  function updateSelectedCount() {
    selectedCount.textContent = tempSelection.length;
  }

  langSearch.addEventListener('input', function () {
    renderLangList(langSearch.value);
  });

  // Salvar alterações de idiomas
  confirmLangBtn.addEventListener('click', function () {
    if (tempSelection.length === 0) {
      showToast('Escolha pelo menos 1 idioma', 'fa-exclamation-circle');
      return;
    }
    userLangs = tempSelection.slice();
    updateLangButtonDisplay();

    // Persiste no localStorage (atualiza o "usuário")
    const user = loadUserData() || {};
    user.langs = userLangs.map(function (l) { return l.code; });
    localStorage.setItem('ml_user', JSON.stringify(user));

    closeModal();
    showToast('Idiomas atualizados com sucesso!', 'fa-check-circle');
  });

  function updateLangButtonDisplay() {
    if (userLangs.length === 0) {
      loginLangCount.textContent = 'Nenhum idioma';
      loginLangPreview.textContent = 'Toque para escolher';
      return;
    }
    loginLangCount.textContent = userLangs.length + ' idioma(s)';
    loginLangPreview.textContent = userLangs.map(function (l) {
      return l.flag + ' ' + l.name;
    }).join(' · ');
  }

  /* ----------------------------------------------------------------------
     VALIDAÇÃO + LOGIN
     ---------------------------------------------------------------------- */
  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function validateForm() {
    let ok = true;

    const email = emailInput.value.trim();
    if (!email) {
      emailError.textContent = 'Informe seu e-mail.';
      emailInput.parentElement.classList.add('invalid');
      ok = false;
    } else if (!isValidEmail(email)) {
      emailError.textContent = 'E-mail inválido.';
      emailInput.parentElement.classList.add('invalid');
      ok = false;
    } else {
      emailError.textContent = '';
      emailInput.parentElement.classList.remove('invalid');
    }

    const pwd = passwordInput.value;
    if (!pwd) {
      passwordError.textContent = 'Informe sua senha.';
      passwordInput.parentElement.classList.add('invalid');
      ok = false;
    } else if (pwd.length < 6) {
      passwordError.textContent = 'Mínimo 6 caracteres.';
      passwordInput.parentElement.classList.add('invalid');
      ok = false;
    } else {
      passwordError.textContent = '';
      passwordInput.parentElement.classList.remove('invalid');
    }

    return ok;
  }

  [emailInput, passwordInput].forEach(function (input) {
    input.addEventListener('input', function () {
      input.parentElement.classList.remove('invalid');
      const err = input.parentElement.parentElement.querySelector('.error');
      if (err) err.textContent = '';
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Corrija os campos destacados', 'fa-exclamation-triangle');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';

    setTimeout(function () {
      const langsText = userLangs.length
        ? userLangs.map(function (l) { return l.name; }).join(', ')
        : 'nenhum idioma';

      showToast('Login efetuado! Idiomas: ' + langsText, 'fa-check-circle');

      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-right-to-bracket"></i> Entrar';

      // Aqui, em um sistema real, você redirecionaria para a home:
      // window.location.href = '../home/home.html';
    }, 1200);
  });

  /* ----------------------------------------------------------------------
     INICIALIZAÇÃO
     ---------------------------------------------------------------------- */
  populateFromUser();

})();