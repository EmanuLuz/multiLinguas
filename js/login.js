// ===== REFERÊNCIAS AOS ELEMENTOS =====
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('senha');
const togglePassword = document.getElementById('togglePassword');
const btnLogin = document.getElementById('btnLogin');
const emailError = document.getElementById('emailError');
const senhaError = document.getElementById('senhaError');
const feedbackMessage = document.getElementById('feedbackMessage');
const feedbackText = document.getElementById('feedbackText');

// ===== TOGGLE DE VISIBILIDADE DA SENHA =====
togglePassword.addEventListener('click', function () {
  const type = senhaInput.getAttribute('type') === 'password' ? 'text' : 'password';
  senhaInput.setAttribute('type', type);

  const icon = this.querySelector('i');
  icon.classList.toggle('fa-eye');
  icon.classList.toggle('fa-eye-slash');
});

// ===== VALIDAÇÃO EM TEMPO REAL =====
emailInput.addEventListener('input', function () {
  if (this.value.trim() === '') {
    this.classList.remove('erro');
    emailError.classList.remove('visible');
  } else if (!isValidEmail(this.value)) {
    this.classList.add('erro');
    emailError.textContent = 'Por favor, insira um e-mail válido.';
    emailError.classList.add('visible');
  } else {
    this.classList.remove('erro');
    emailError.classList.remove('visible');
  }
});

senhaInput.addEventListener('input', function () {
  if (this.value.length > 0 && this.value.length < 6) {
    this.classList.add('erro');
    senhaError.textContent = 'A senha deve ter pelo menos 6 caracteres.';
    senhaError.classList.add('visible');
  } else {
    this.classList.remove('erro');
    senhaError.classList.remove('visible');
  }
});

// ===== FUNÇÃO DE VALIDAÇÃO DE E-MAIL =====
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// ===== FUNÇÃO PARA EXIBIR FEEDBACK =====
function showFeedback(message, tipo) {
  feedbackMessage.className = 'feedback-message visible ' + tipo;
  feedbackText.textContent = message;

  // Ícone dinâmico
  const icon = feedbackMessage.querySelector('i');
  icon.className = tipo === 'erro' ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';

  // Esconde após 5 segundos
  setTimeout(() => {
    feedbackMessage.classList.remove('visible');
  }, 5000);
}

// ===== SUBMIT DO FORMULÁRIO =====
loginForm.addEventListener('submit', function (e) {
  e.preventDefault();

  // Limpa estados anteriores
  emailInput.classList.remove('erro');
  senhaInput.classList.remove('erro');
  emailError.classList.remove('visible');
  senhaError.classList.remove('visible');
  feedbackMessage.classList.remove('visible');

  // Validações
  let valido = true;

  // Validação do e-mail
  const email = emailInput.value.trim();
  if (email === '' || !isValidEmail(email)) {
    emailInput.classList.add('erro');
    emailError.textContent = email === ''
      ? 'O campo e-mail é obrigatório.'
      : 'Por favor, insira um e-mail válido.';
    emailError.classList.add('visible');
    valido = false;
  }

  // Validação da senha
  const senha = senhaInput.value;
  if (senha === '') {
    senhaInput.classList.add('erro');
    senhaError.textContent = 'O campo senha é obrigatório.';
    senhaError.classList.add('visible');
    valido = false;
  } else if (senha.length < 6) {
    senhaInput.classList.add('erro');
    senhaError.textContent = 'A senha deve ter pelo menos 6 caracteres.';
    senhaError.classList.add('visible');
    valido = false;
  }

  if (!valido) {
    showFeedback('Por favor, corrija os campos destacados.', 'erro');
    return;
  }

  // ===== SIMULAÇÃO DE LOGIN (AQUI ENTRARIA A CHAMADA À API) =====
  // No back-end real, isso seria uma requisição POST para /api/login
  // com os dados do formulário, validando contra a tabela `usuario` do MySQL:
  //
  // SELECT id_usuario, nome, email, senha_hash, faixa_etaria, tipo_perfil, id_turma
  // FROM usuario
  // WHERE email = ? AND senha_hash = SHA2(?, 256);
  //
  // Também seria verificado o `status` na tabela `assinatura_vip` para
  // determinar o tipo de plano do usuário (Gratuito/VIP) e seus privilégios.

  btnLogin.classList.add('loading');
  btnLogin.disabled = true;

  // Simula o tempo de resposta do servidor (2 segundos)
  setTimeout(() => {
    // Simulação: credenciais de teste
    const usuarioTeste = {
      email: 'estudante@multilinguas.com',
      senha: '123456'
    };

    if (email === usuarioTeste.email && senha === usuarioTeste.senha) {
      // Login bem-sucedido
      showFeedback('Login realizado com sucesso! Redirecionando...', 'sucesso');

      // Armazena dados do usuário (simulando sessão)
      localStorage.setItem('usuarioLogado', JSON.stringify({
        nome: 'Estudante',
        email: email,
        tipoPerfil: 'aluno',
        plano: 'gratuito'
      }));

      // Redireciona para a home após 1.5 segundos
      setTimeout(() => {
        window.location.href = 'home.html';
      }, 1500);
    } else {
      // Login falhou
      showFeedback('E-mail ou senha incorretos. Verifique suas credenciais.', 'erro');
      emailInput.classList.add('erro');
      senhaInput.classList.add('erro');
    }

    btnLogin.classList.remove('loading');
    btnLogin.disabled = false;
  }, 2000);
});

// ===== PREENCHER E-MAIL SALVO (LEMBRAR DE MIM) =====
window.addEventListener('load', function () {
  const emailSalvo = localStorage.getItem('emailLembrado');
  if (emailSalvo) {
    emailInput.value = emailSalvo;
    document.getElementById('lembrar').checked = true;
  }
});

// ===== SALVAR E-MAIL AO MARCAR "LEMBRAR DE MIM" =====
document.getElementById('lembrar').addEventListener('change', function () {
  if (this.checked) {
    localStorage.setItem('emailLembrado', emailInput.value.trim());
  } else {
    localStorage.removeItem('emailLembrado');
  }
});

// Atualiza o e-mail lembrado quando o usuário digita
emailInput.addEventListener('input', function () {
  if (document.getElementById('lembrar').checked) {
    localStorage.setItem('emailLembrado', this.value.trim());
  }
});