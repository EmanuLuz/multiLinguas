document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formVocabulario');
  const tabelaCorpo = document.getElementById('tabelaCorpo');
  const selectEstilo = document.getElementById('estiloVocabulario');
  const inputFonte = document.getElementById('tamanhoFonte');
  const textoExemplo = document.getElementById('textoExemplo');
  const badgePreview = document.getElementById('badgePreview');
  const labelTamanho = document.getElementById('labelTamanho');
  const resumoFonte = document.getElementById('resumoFonte');
  const resumoEstilo = document.getElementById('resumoEstilo');
  const resumoTotal = document.getElementById('resumoTotal');

  const API_URL = 'http://localhost:3000';

  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  if (!usuarioLogado || !usuarioLogado.id_usuario) {
    alert('Sessão expirada. Faça login novamente.');
    window.location.href = 'login.html';
    return;
  }

  // frases de exemplo
  const exemplos = {
    simples: "Exemplo: Esta frase demonstra como os textos das lições serão formatados com linguagem simples e direta.",
    formal: "Exemplo: Esta mensagem é apresentada seguindo os padrões formais de comunicação corporativa.",
    academico: "Exemplo: Este enunciado exemplifica a aplicação de terminologia técnica e rigor analítico."
  };

  // atualiza a caixa de pré-visualização
  function atualizarSimulacao() {
    const estilo = selectEstilo.value;
    const fonte = inputFonte.value || 16;

    textoExemplo.textContent = exemplos[estilo] || exemplos.simples;
    textoExemplo.style.fontSize = `${fonte}px`;
    badgePreview.textContent = estilo;
    labelTamanho.textContent = `${fonte} px`;
  }

  selectEstilo.addEventListener('change', atualizarSimulacao);
  inputFonte.addEventListener('input', atualizarSimulacao);

  // buscar histórico do usuário
  async function carregarPreferencias() {
    try {
      const response = await axios.get(`${API_URL}/api/vocabulario/${usuarioLogado.id_usuario}`);
      const dados = response.data;

      renderizarTabela(dados);
      atualizarResumo(dados);
    } catch (error) {
      console.error('Erro ao buscar preferências:', error);
      tabelaCorpo.innerHTML = `<tr><td colspan="4" style="text-align:center;">Erro ao carregar os dados.</td></tr>`;
    }
  }

  // carregar linhas na tabela
  function renderizarTabela(lista) {
    tabelaCorpo.innerHTML = '';

    if (!lista || lista.length === 0) {
      tabelaCorpo.innerHTML = `<tr><td colspan="4" style="text-align:center;">Nenhum ajuste registrado.</td></tr>`;
      return;
    }

    lista.forEach(item => {
      // formata a data recebida do MySQL
      const dataFmt = new Date(item.data_registro).toLocaleString('pt-BR');

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${dataFmt}</strong></td>
        <td><span class="badge-estilo">${item.estilo_vocabulario}</span></td>
        <td>${item.tamanho_fonte} px</td>
        <td style="text-align: center;">
          <button class="btn-deletar" data-id="${item.id_vocabulario}" title="Excluir">
            <i class="fas fa-trash-alt"></i>
          </button>
        </td>
      `;
      tabelaCorpo.appendChild(tr);
    });

    document.querySelectorAll('.btn-deletar').forEach(btn => {
      btn.addEventListener('click', () => excluirRegistro(btn.dataset.id));
    });
  }

  function atualizarResumo(lista) {
    resumoTotal.textContent = lista.length;

    if (!lista || lista.length === 0) {
      resumoFonte.textContent = '16 px';
      resumoEstilo.textContent = 'Simples';
      atualizarSimulacao();
      return;
    }

    const maisRecente = lista[0];
    resumoFonte.textContent = `${maisRecente.tamanho_fonte} px`;
    resumoEstilo.textContent = maisRecente.estilo_vocabulario;

    selectEstilo.value = maisRecente.estilo_vocabulario;
    inputFonte.value = maisRecente.tamanho_fonte;
    atualizarSimulacao();
  }

  // cadastrar nova preferência
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_URL}/api/vocabulario`, {
        id_usuario: usuarioLogado.id_usuario,
        estilo_vocabulario: selectEstilo.value,
        tamanho_fonte: inputFonte.value
      });

      carregarPreferencias();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar no banco de dados.');
    }
  });

  // excluir preferência
  async function excluirRegistro(id_vocabulario) {
    if (!confirm('Deseja realmente apagar esta preferência?')) return;

    try {
      await axios.delete(`${API_URL}/api/vocabulario/${id_vocabulario}`);
      carregarPreferencias();
    } catch (error) {
      console.error('Erro ao excluir:', error);
      alert('Erro ao apagar do banco de dados.');
    }
  }

  // inicializacao
  carregarPreferencias();
});