document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('cadastroForm');
  const feedback = document.getElementById('feedbackMessage');
  const feedbackText = document.getElementById('feedbackText');
  const btn = document.getElementById('btnCadastro');

  const nome = document.getElementById('nome');
  const email = document.getElementById('email');
  const dataNasc = document.getElementById('data_nascimento');
  const perfil = document.getElementById('tipo_perfil');
  const faixa = document.getElementById('faixa_etaria');
  const senha = document.getElementById('senha');
  const confirmar = document.getElementById('confirmar_senha');
  const termos = document.getElementById('termos');

  const API = 'http://localhost:3000';

  document.querySelectorAll('.error-message').forEach(e => e.style.display = 'none');
  feedback.style.display = 'none';

  // -------- Idade --------
  function calcularIdade(data) {
    const hoje = new Date();
    const nasc = new Date(data + 'T00:00:00');
    let idade = hoje.getFullYear() - nasc.getFullYear();
    const m = hoje.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
    return idade;
  }

  // -------- Faixa etária (ENUM) --------
  dataNasc.addEventListener('change', () => {
    if (!dataNasc.value) return;
    const idade = calcularIdade(dataNasc.value);

    if (idade >= 8 && idade <= 14) {
      faixa.value = '8 a 14 anos';
      faixa.dataset.value = '8_14';
    } else if (idade >= 15 && idade <= 17) {
      faixa.value = '15 a 17 anos';
      faixa.dataset.value = '15_17';
    } else if (idade >= 18) {
      faixa.value = 'Adulto (18+)';
      faixa.dataset.value = 'adulto';
    } else {
      faixa.value = 'Idade mínima: 8 anos';
      faixa.dataset.value = '';
    }
  });

  // -------- Mostrar/ocultar senha --------
  document.querySelectorAll('.toggle-password').forEach(b => {
    b.addEventListener('click', () => {
      const input = b.parentElement.querySelector('input');
      const isPass = input.type === 'password';
      input.type = isPass ? 'text' : 'password';
      b.querySelector('i').className = isPass ? 'fas fa-eye-slash' : 'fas fa-eye';
    });
  });

  // -------- Feedback --------
  function mostrarFeedback(msg, tipo = 'info') {
    const icons = {
      info: 'fa-info-circle',
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle'
    };
    feedback.className = `feedback-message ${tipo}`;
    feedback.querySelector('i').className = `fas ${icons[tipo]}`;
    feedbackText.textContent = msg;
    feedback.style.display = 'flex';
  }

  // -------- Envio --------
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!nome.value.trim() || !email.value.trim() || !dataNasc.value ||
        !perfil.value || !senha.value || !termos.checked) {
      return mostrarFeedback('Preencha todos os campos obrigatórios.', 'error');
    }
    if (senha.value.length < 6) {
      return mostrarFeedback('A senha deve ter ao menos 6 caracteres.', 'error');
    }
    if (senha.value !== confirmar.value) {
      return mostrarFeedback('As senhas não coincidem.', 'error');
    }

    const faixaValor = faixa.dataset.value;
    if (!faixaValor) return mostrarFeedback('Idade mínima: 8 anos.', 'error');

    const payload = {
      nome: nome.value.trim(),
      email: email.value.trim().toLowerCase(),
      senha: senha.value,
      data_nascimento: dataNasc.value,
      faixa_etaria: faixaValor,
      tipo_perfil: perfil.value
    };

    btn.disabled = true;
    btn.classList.add('loading');

    try {
      const res = await fetch(`${API}/api/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Erro ao cadastrar.');

      mostrarFeedback('Conta criada com sucesso!', 'success');
      setTimeout(() => window.location.href = 'login.html', 1500);

    } catch (err) {
      console.error(err);
      mostrarFeedback(err.message || 'Falha na conexão.', 'error');
    } finally {
      btn.disabled = false;
      btn.classList.remove('loading');
    }
  });
});