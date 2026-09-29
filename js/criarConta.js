// ===== CATÁLOGO DE IDIOMAS =====
const IDIOMAS_DISPONIVEIS = [
  { id: "en", nome: "Inglês", flag: "🇺🇸" },
  { id: "es", nome: "Espanhol", flag: "🇪🇸" },
  { id: "fr", nome: "Francês", flag: "🇫🇷" },
  { id: "de", nome: "Alemão", flag: "🇩🇪" },
  { id: "it", nome: "Italiano", flag: "🇮🇹" },
  { id: "jp", nome: "Japonês", flag: "🇯🇵" },
  { id: "kr", nome: "Coreano", flag: "🇰🇷" },
  { id: "cn", nome: "Mandarim", flag: "🇨🇳" },
  { id: "ru", nome: "Russo", flag: "🇷🇺" },
  { id: "ar", nome: "Árabe", flag: "🇸🇦" },
  { id: "pt", nome: "Português", flag: "🇧🇷" },
  { id: "nl", nome: "Holandês", flag: "🇳🇱" },
];

// ===== ELEMENTOS =====
const form = document.getElementById("form-cadastro");
const etapaIdiomas = document.getElementById("etapa-idiomas");
const stepInd1 = document.getElementById("step-indicator-1");
const stepInd2 = document.getElementById("step-indicator-2");
const grid = document.getElementById("lista-idiomas");
const contador = document.getElementById("contador-selecionados");
const btnFinalizar = document.getElementById("btn-finalizar");
const btnVoltar = document.getElementById("btn-voltar-dados");

const erros = {
  nome: document.getElementById("erro-nome"),
  email: document.getElementById("erro-email"),
  idade: document.getElementById("erro-idade"),
  senha: document.getElementById("erro-senha"),
  confirmar: document.getElementById("erro-confirmar"),
  termos: document.getElementById("erro-termos"),
};

let dadosCadastro = null;
const selecionados = new Set();

// ===== VALIDAÇÃO =====
function limparErros() {
  Object.values(erros).forEach((el) => (el.textContent = ""));
  document.querySelectorAll("input").forEach((i) => i.classList.remove("input-error"));
}

function mostrarErro(campo, msg) {
  erros[campo].textContent = msg;
  const inputId = campo === "confirmar" ? "confirmar-senha" : campo;
  const input = document.getElementById(inputId);
  if (input) input.classList.add("input-error");
}

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ===== ETAPA 1 =====
form.addEventListener("submit", (e) => {
  e.preventDefault();
  limparErros();

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const idade = parseInt(document.getElementById("idade").value, 10);
  const senha = document.getElementById("senha").value;
  const confirmar = document.getElementById("confirmar-senha").value;
  const termos = document.getElementById("termos").checked;

  let valido = true;

  if (nome.length < 3) { mostrarErro("nome", "Informe seu nome completo (mín. 3 caracteres)."); valido = false; }
  if (!emailValido(email)) { mostrarErro("email", "Informe um e-mail válido."); valido = false; }
  if (isNaN(idade) || idade < 8) { mostrarErro("idade", "A idade mínima é 8 anos."); valido = false; }
  else if (idade > 120) { mostrarErro("idade", "Idade inválida."); valido = false; }
  if (senha.length < 6) { mostrarErro("senha", "A senha deve ter no mínimo 6 caracteres."); valido = false; }
  if (senha !== confirmar) { mostrarErro("confirmar", "As senhas não coincidem."); valido = false; }
  if (!termos) { erros.termos.textContent = "Você precisa aceitar os termos."; valido = false; }

  if (!valido) return;

  const existente = JSON.parse(localStorage.getItem("usuarioMultiLinguas"));
  if (existente && existente.email === email) {
    mostrarErro("email", "Este e-mail já está cadastrado.");
    return;
  }

  dadosCadastro = {
    id: Date.now(),
    nome, email, idade, senha,
    faixaEtaria: idade >= 8 && idade <= 14 ? "infantil" : "adulto",
    plano: "Gratuito",
    idiomas: [],
    criadoEm: new Date().toISOString(),
  };

  form.classList.add("hidden");
  etapaIdiomas.classList.remove("hidden");
  stepInd1.classList.remove("active");
  stepInd2.classList.add("active");
});

// ===== ETAPA 2 =====
function renderizarIdiomas() {
  IDIOMAS_DISPONIVEIS.forEach((idioma) => {
    const card = document.createElement("div");
    card.className = "idioma-card";
    card.dataset.id = idioma.id;
    card.innerHTML = `
      <span class="idioma-flag">${idioma.flag}</span>
      <span class="idioma-nome">${idioma.nome}</span>
    `;
    card.addEventListener("click", () => {
      if (selecionados.has(idioma.id)) {
        selecionados.delete(idioma.id);
        card.classList.remove("selecionado");
      } else {
        selecionados.add(idioma.id);
        card.classList.add("selecionado");
      }
      atualizarContador();
    });
    grid.appendChild(card);
  });
}

function atualizarContador() {
  const qtd = selecionados.size;
  contador.textContent = `${qtd} idioma${qtd !== 1 ? "s" : ""} selecionado${qtd !== 1 ? "s" : ""}`;
  btnFinalizar.disabled = qtd === 0;
}

btnVoltar.addEventListener("click", () => {
  etapaIdiomas.classList.add("hidden");
  form.classList.remove("hidden");
  stepInd2.classList.remove("active");
  stepInd1.classList.add("active");
});

btnFinalizar.addEventListener("click", () => {
  if (selecionados.size === 0) return;

  const idiomasEscolhidos = IDIOMAS_DISPONIVEIS.filter((i) => selecionados.has(i.id));
  dadosCadastro.idiomas = idiomasEscolhidos;

  localStorage.setItem("usuarioMultiLinguas", JSON.stringify(dadosCadastro));
  localStorage.setItem("usuarioLogado", JSON.stringify({ email: dadosCadastro.email }));

  window.location.href = "perfil.html";
});

renderizarIdiomas();
atualizarContador();