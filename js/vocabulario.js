document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formVocabulario');
  const tabelaCorpo = document.getElementById('tabelaCorpo');
  const inputPalavra = document.getElementById('palavraExpressao');
  const inputTraducao = document.getElementById('traducao');
  const inputFrequencia = document.getElementById('frequenciaUso');

  // elementos do RF03 (preferências de Leitura)
  const formPreferencias = document.getElementById('formPreferenciasLeitura');
  const selectEstilo = document.getElementById('estiloVocabulario');
  const inputFonte = document.getElementById('tamanhoFonte');

  const API_URL = 'http://localhost:3000';

  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  if (!usuarioLogado || !usuarioLogado.id_usuario) {
    alert('Sessão expirada. Faça login novamente.');
    window.location.href = 'login.html';
    return;
  }

  // buscar palavras salvas no banco
  async function carregarVocabulario() {
    try {
      const response = await axios.get(`${API_URL}/api/vocabulario/${usuarioLogado.id_usuario}`);
      const dados = response.data;

      renderizarTabela(dados);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      tabelaCorpo.innerHTML = `<tr><td colspan="5" style="text-align:center;">Erro ao carregar os dados.</td></tr>`;
    }
  }

  // carregar linhas na tabela
  function renderizarTabela(lista) {
    tabelaCorpo.innerHTML = '';

    if (!lista || lista.length === 0) {
      tabelaCorpo.innerHTML = `<tr><td colspan="5" style="text-align:center;">Nenhuma palavra registrada.</td></tr>`;
      return;
    }

    lista.forEach(item => {
      // formata a data recebida do MySQL
      const dataFmt = new Date(item.data_ultima_ocorrencia).toLocaleDateString('pt-BR');

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${item.palavra_expressao}</strong></td>
        <td>${item.traducao}</td>
        <td>${item.frequencia_uso}x</td>
        <td>${dataFmt}</td>
        <td style="text-align: center;">
          <button class="btn-deletar" data-id="${item.id_recomendacao}" title="Excluir">
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

  // cadastrar nova preferência
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

  try {
    await axios.post(`${API_URL}/api/vocabulario`, {
        id_usuario: usuarioLogado.id_usuario,
        palavra_expressao: inputPalavra.value,
        traducao: inputTraducao.value,
        frequencia_uso: parseInt(inputFrequencia.value, 10) || 1
      });

    // Recarrega os registros e atualiza a tabela na tela
    form.reset();
      inputFrequencia.value = 1;
      carregarVocabulario();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar no banco de dados.');
    }
  });

  // excluir preferência
  async function excluirRegistro(id_recomendacao) {
    if (!confirm('Deseja realmente apagar esta palavra?')) return;

    try {
      await axios.delete(`${API_URL}/api/vocabulario/${id_recomendacao}`);
      carregarVocabulario();
    } catch (error) {
      console.error('Erro ao excluir:', error);
      alert('Erro ao apagar do banco de dados.');
    }
  }

  // carregar preferências de leitura (RF03)
  function carregarPreferenciasLeitura() {
    const configs = JSON.parse(localStorage.getItem('preferenciasLeitura')) || {
      estilo: 'simples',
      fonte: 16
    };

    if (selectEstilo) selectEstilo.value = configs.estilo;
    if (inputFonte) inputFonte.value = configs.fonte;
  }

  // salvar as preferências de leitura (RF03)
  if (formPreferencias) {
    formPreferencias.addEventListener('submit', (e) => {
      e.preventDefault();

      const preferencias = {
        estilo: selectEstilo.value,
        fonte: parseInt(inputFonte.value, 10)
      };

      localStorage.setItem('preferenciasLeitura', JSON.stringify(preferencias));
      alert('✅ Preferências de leitura atualizadas com sucesso!');
    });
  }

  // inicializacao
  carregarPreferenciasLeitura();
  carregarPreferencias();
});