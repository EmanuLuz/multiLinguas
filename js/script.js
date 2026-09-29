(function () {
  'use strict';

  // ================================================================
  // 25 IDIOMAS SUPORTADOS (códigos da Google Translate)
  // ================================================================
  const LANGUAGES = [
    { code: 'pt',    name: 'Português',   flag: '🇧🇷' },
    { code: 'en',    name: 'Inglês',      flag: '🇺🇸' },
    { code: 'es',    name: 'Espanhol',    flag: '🇪🇸' },
    { code: 'fr',    name: 'Francês',     flag: '🇫🇷' },
    { code: 'de',    name: 'Alemão',      flag: '🇩🇪' },
    { code: 'it',    name: 'Italiano',    flag: '🇮🇹' },
    { code: 'ja',    name: 'Japonês',     flag: '🇯🇵' },
    { code: 'zh-CN', name: 'Chinês',      flag: '🇨🇳' },
    { code: 'ko',    name: 'Coreano',     flag: '🇰🇷' },
    { code: 'ru',    name: 'Russo',       flag: '🇷🇺' },
    { code: 'ar',    name: 'Árabe',       flag: '🇸🇦' },
    { code: 'hi',    name: 'Hindi',       flag: '🇮🇳' },
    { code: 'nl',    name: 'Holandês',    flag: '🇳🇱' },
    { code: 'sv',    name: 'Sueco',       flag: '🇸🇪' },
    { code: 'pl',    name: 'Polonês',     flag: '🇵🇱' },
    { code: 'tr',    name: 'Turco',       flag: '🇹🇷' },
    { code: 'el',    name: 'Grego',       flag: '🇬🇷' },
    { code: 'he',    name: 'Hebraico',    flag: '🇮🇱' },
    { code: 'th',    name: 'Tailandês',   flag: '🇹🇭' },
    { code: 'vi',    name: 'Vietnamita',  flag: '🇻🇳' },
    { code: 'id',    name: 'Indonésio',   flag: '🇮🇩' },
    { code: 'uk',    name: 'Ucraniano',   flag: '🇺🇦' },
    { code: 'ro',    name: 'Romeno',      flag: '🇷🇴' },
    { code: 'da',    name: 'Dinamarquês', flag: '🇩🇰' },
    { code: 'no',    name: 'Norueguês',   flag: '🇳🇴' }
  ];

  let sourceLang = LANGUAGES[0];
  let targetLang = LANGUAGES[1];

  // DOM
  const sourcePicker = document.getElementById('sourcePicker');
  const targetPicker = document.getElementById('targetPicker');
  const sourceBtn    = document.getElementById('sourceBtn');
  const targetBtn    = document.getElementById('targetBtn');
  const sourceMenu   = document.getElementById('sourceMenu');
  const targetMenu   = document.getElementById('targetMenu');
  const sourceFlag   = document.getElementById('sourceFlag');
  const sourceName   = document.getElementById('sourceName');
  const targetFlag   = document.getElementById('targetFlag');
  const targetName   = document.getElementById('targetName');
  const swapBtn      = document.getElementById('swapBtn');
  const sourceText   = document.getElementById('sourceText');
  const translated   = document.getElementById('translatedText');
  const translateBtn = document.getElementById('translateBtn');
  const outputArea   = document.getElementById('outputArea');
  const charCount    = document.getElementById('charCount');
  const clearBtn     = document.getElementById('clearBtn');
  const micBtn       = document.getElementById('micBtn');
  const copyBtn      = document.getElementById('copyBtn');

  // ================================================================
  // CONSTRUIR MENUS
  // ================================================================
  function buildMenu(menuEl, selectedCode, onPick) {
    menuEl.innerHTML = '';
    LANGUAGES.forEach(function (lang) {
      const li = document.createElement('li');
      li.dataset.code = lang.code;
      li.innerHTML =
        '<span class="flag">' + lang.flag + '</span>' +
        '<span>' + lang.name + '</span>' +
        '<i class="fas fa-check check"></i>';

      if (lang.code === selectedCode) li.classList.add('active');

      li.addEventListener('click', function (e) {
        e.stopPropagation();
        onPick(lang);
        closeAllMenus();
      });

      menuEl.appendChild(li);
    });
  }

  function refreshMenus() {
    buildMenu(sourceMenu, sourceLang.code, function (lang) {
      if (lang.code === targetLang.code) {
        const tmp = sourceLang;
        sourceLang = targetLang;
        targetLang = tmp;
      } else {
        sourceLang = lang;
      }
      renderUI();
      translate();
    });

    buildMenu(targetMenu, targetLang.code, function (lang) {
      if (lang.code === sourceLang.code) {
        const tmp = sourceLang;
        sourceLang = targetLang;
        targetLang = tmp;
      } else {
        targetLang = lang;
      }
      renderUI();
      translate();
    });
  }

  // ================================================================
  // RENDER UI
  // ================================================================
  function renderUI() {
    sourceFlag.textContent = sourceLang.flag;
    sourceName.textContent = sourceLang.name;
    targetFlag.textContent = targetLang.flag;
    targetName.textContent = targetLang.name;
    refreshMenus();
  }

  // ================================================================
  // ABRIR / FECHAR MENUS
  // ================================================================
  function closeAllMenus() {
    sourcePicker.classList.remove('open');
    targetPicker.classList.remove('open');
  }

  sourceBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    const isOpen = sourcePicker.classList.contains('open');
    closeAllMenus();
    if (!isOpen) sourcePicker.classList.add('open');
  });

  targetBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    const isOpen = targetPicker.classList.contains('open');
    closeAllMenus();
    if (!isOpen) targetPicker.classList.add('open');
  });

  document.addEventListener('click', closeAllMenus);

  // ================================================================
  // SWAP
  // ================================================================
  swapBtn.addEventListener('click', function () {
    const tmp = sourceLang;
    sourceLang = targetLang;
    targetLang = tmp;

    const current = translated.textContent.trim();
    if (current && !current.startsWith('Digite') && !current.startsWith('Traduzindo') && !current.startsWith('⚠️')) {
      sourceText.value = current;
      updateCounter();
    }

    renderUI();
    translate();
  });

  // ================================================================
  // CONTADOR
  // ================================================================
  function updateCounter() {
    charCount.textContent = sourceText.value.length;
  }
  sourceText.addEventListener('input', updateCounter);

  // ================================================================
  // TRADUÇÃO REAL via Google Translate (endpoint público gtx)
  // ================================================================
  function translate() {
    const text = sourceText.value.trim();

    if (!text) {
      translated.textContent = 'Digite algo para traduzir...';
      return;
    }

    outputArea.style.opacity = '0.45';
    translateBtn.disabled = true;
    translateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Traduzindo...';

    const url =
      'https://translate.googleapis.com/translate_a/single' +
      '?client=gtx&sl=' + sourceLang.code +
      '&tl=' + targetLang.code +
      '&dt=t&q=' + encodeURIComponent(text);

    fetch(url)
      .then(function (response) {
        if (!response.ok) throw new Error('Falha na API');
        return response.json();
      })
      .then(function (data) {
        let result = '';
        if (data && data[0]) {
          for (let i = 0; i < data[0].length; i++) {
            if (data[0][i] && data[0][i][0]) {
              result += data[0][i][0];
            }
          }
        }
        if (!result) result = '—';
        translated.textContent = result;
        outputArea.style.opacity = '1';
        translateBtn.innerHTML = '<i class="fas fa-check"></i> Traduzido!';
        setTimeout(function () {
          translateBtn.innerHTML = '<i class="fas fa-language"></i> Traduzir agora';
        }, 1300);
      })
      .catch(function (err) {
        console.error(err);
        translated.textContent = '⚠️ Não foi possível traduzir. Verifique sua conexão.';
        outputArea.style.opacity = '1';
        translateBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Erro';
        setTimeout(function () {
          translateBtn.innerHTML = '<i class="fas fa-language"></i> Traduzir agora';
        }, 1600);
      })
      .finally(function () {
        translateBtn.disabled = false;
      });
  }

  translateBtn.addEventListener('click', translate);

  // Atalho Ctrl/Cmd + Enter
  sourceText.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      translate();
    }
  });

  // Tradução automática com debounce ao digitar
  let debounceTimer;
  sourceText.addEventListener('input', function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      if (sourceText.value.trim().length > 0) translate();
    }, 900);
  });

  // ================================================================
  // LIMPAR
  // ================================================================
  clearBtn.addEventListener('click', function () {
    sourceText.value = '';
    translated.textContent = '';
    updateCounter();
    sourceText.focus();
  });

  // ================================================================
  // COPIAR
  // ================================================================
  copyBtn.addEventListener('click', function () {
    const text = translated.textContent;
    if (!text || text.startsWith('Digite')) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(function () {
          copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
        }, 1200);
      });
    }
  });

  // ================================================================
  // MICROFONE (Web Speech API)
  // ================================================================
  micBtn.addEventListener('click', function () {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      micBtn.style.background = '#ffd7d7';
      setTimeout(function () { micBtn.style.background = ''; }, 800);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = sourceLang.code === 'zh-CN' ? 'zh-CN' : sourceLang.code;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    micBtn.style.background = 'var(--roxo-600)';
    micBtn.style.color = 'white';
    sourceText.placeholder = '🎤 Ouvindo...';

    try {
      recognition.start();
    } catch (err) {
      console.warn(err);
    }

    recognition.onresult = function (event) {
      const transcript = event.results[0][0].transcript;
      sourceText.value = transcript;
      updateCounter();
      translate();
    };

    recognition.onerror = function () {
      sourceText.placeholder = 'Digite qualquer palavra ou frase...';
    };

    recognition.onend = function () {
      micBtn.style.background = '';
      micBtn.style.color = '';
      sourceText.placeholder = 'Digite qualquer palavra ou frase...';
    };
  });

  // ================================================================
  // INICIALIZAÇÃO
  // ================================================================
  renderUI();
  updateCounter();
  setTimeout(translate, 700);

})();