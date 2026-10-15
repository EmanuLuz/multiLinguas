const form  = document.getElementById('loginForm');
const email = document.getElementById('loginEmail');
const senha = document.getElementById('loginPassword');
const btn   = document.getElementById('loginSubmitBtn');
const toast = document.getElementById('toast');

function aviso(msg) {
  toast.textContent = msg;                
  toast.classList.add('show');            
  setTimeout(() => toast.classList.remove('show'), 2500);  
}

  document.querySelectorAll('.toggle-password').forEach(b => { // mostrar/ocultar senha
    b.addEventListener('click', () => {
      const input = b.parentElement.querySelector('input');   
      const oculto = input.type === 'password';                
      input.type = oculto ? 'text' : 'password';              
      b.querySelector('i').className = oculto                
        ? 'fas fa-eye-slash'
        : 'fas fa-eye';
    });
  });

form.addEventListener('submit', async (e) => {
  e.preventDefault();                      
 
  if (!email.value || !senha.value) { // validação
    return aviso('Preencha e-mail e senha.');
  }

  btn.disabled = true;
  btn.textContent = 'Entrando...';

  try { // envia pro servidor
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        senha: senha.value
      })
    });

    const data = await res.json(); // resposta do servidor

    if (!res.ok) {
      throw new Error(data.message || 'Erro ao entrar.');
    }

    aviso('Bem-vindo, ' + data.usuario.nome + '!'); // funcionou
    setTimeout(() => window.location.href = 'home.html', 1200);

  } catch (err) {
    aviso(err.message);
    console.error(err);

  } finally {
    btn.disabled = false;
    btn.textContent = 'Entrar';
  }
});