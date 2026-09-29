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

// ===== PROTEÇÃO DE ROTA =====
const usuario = JSON.parse(localStorage.getItem("usuarioMultiLinguas"));
const logado = JSON.parse(localStorage.getItem("usuarioLogado"));

if (!usuario || !logado || logado.email !== usuario.email) {
  window.location.href = "login.html";
}

// ===== DADOS DO USUÁRIO =====
document.getElementById("perfil-nome").textContent = usuario.nome;
document.getElementById("perfil-email").textContent = usuario.email;
document.getElementById("perfil-idade").textContent = `${usuario.idade} anos`;
document.getElementById("perfil-faixa").textContent =
  usuario.faixaEtaria === "infantil" ? "Infantil (8–14)" : "Adulto (15+)";
document.getElementById("perfil-plano").textContent = usuario.plano || "Gratuito";

// ===== IDIOMAS =====
const selecionados = new Set(usuario.idiomas.map((i) => i.id));
const grid = document.getElementById("lista-idiomas-perfil");
const contador = document.getElementById("contador-perfil");
const btnSalvar = document.getElementById("btn-salvar-idiomas");

// ===== RENDERIZA CARDS =====
function renderizar() {
  grid.innerHTML = "";
  IDIOMAS_DISPONIVEIS.forEach((idioma) => {
    const card = document.createElement("div");
    card.className = "idioma-card" + (selecionados.has(idioma.id) ? " selecionado" : "");
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
      atualizar();
    });

    grid.appendChild(card);
  });

  atualizar();
}

// ===== ATUALIZA CONTADOR E BOTÃO =====
function atualizar() {
  const qtd = selecionados.size;
  contador.textContent = `${qtd} idioma${qtd !== 1 ? "s" : ""} selecionado${qtd !== 1 ? "s" : ""}`;

  const atuais = usuario.idiomas.map((i) => i.id).sort().join(",");
  const novos = Array.from(selecionados).sort().join(",");

  btnSalvar.disabled = qtd === 0 || atuais === novos;
}

// ===== SALVAR ALTERAÇÕES =====
btnSalvar.addEventListener("click", () => {
  const novosIdiomas = IDIOMAS_DISPONIVEIS.filter((i) => selecionados.has(i.id));

  usuario.idiomas = novosIdiomas;
  usuario.atualizadoEm = new Date().toISOString();

  localStorage.setItem("usuarioMultiLinguas", JSON.stringify(usuario));

  btnSalvar.textContent = "Salvo! ✓";
  btnSalvar.disabled = true;

  setTimeout(() => {
    btnSalvar.textContent = "Salvar Idiomas";
    atualizar();
  }, 1500);
});

// ===== LOGOUT =====
document.getElementById("btn-logout").addEventListener("click", () => {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "login.html";
});

// ===== INICIALIZA =====
renderizar();