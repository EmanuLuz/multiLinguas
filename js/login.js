document.addEventListener('DOMContentLoaded', () => {
  const form  = document.getElementById('loginForm');
  const email = document.getElementById('loginEmail');
  const senha = document.getElementById('loginPassword');
  const btn   = document.getElementById('loginSubmitBtn');
  const toast = document.getElementById('toast');

  const API = 'http://localhost:3000';

  function aviso(msg) {
    if (!toast) return alert(msg);
    toast.textContent = msg;                
    toast.classList.add('show');            
    setTimeout(() => toast.classList.remove('show'), 2500);  
  }

  // mostrar / ocultar senha
  document.querySelectorAll('.toggle-password').forEach(b => {
    b.addEventListener('click', () => {
      const input = b.parentElement.querySelector('input');   
      const oculto = input.type === 'password';              
      input.type = oculto ? 'text' : 'password';              
      b.querySelector('i').className = oculto ? 'fas fa-eye-slash' : 'fas fa-eye';
    });
  });

  // envio do formulário
  form.addEventListener('submit', async (e) => {
    e.preventDefault();                     

    // validação
    if (!email.value.trim() || !senha.value.trim()) {
      return aviso('Preencha e-mail e senha.');
    }

    btn.disabled = true;
    btn.textContent = 'Entrando...';

    // objeto (tirar duvida com o professor)
    try {
      const res = await axios.post(`${API}/api/login`, {
        email: email.value.trim().toLowerCase(),
        senha: senha.value
      });

      const data = res.data;

      // salva os dados do usuário
      localStorage.setItem('usuarioLogado', JSON.stringify(data.usuario));

      aviso('Bem-vindo, ' + data.usuario.nome + '!');

      // redirecionamento
      setTimeout(() => {
        window.location.href = 'home.html';
      }, 1200);

    } catch (err) {
      const msgErro = err.response?.data?.message || 'Falha ao conectar com o servidor.';
      aviso(msgErro);
      console.error(err);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Entrar';
    }
  });
});