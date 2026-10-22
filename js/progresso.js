document.addEventListener('DOMContentLoaded', () => {
  const tabela = document.getElementById('tabelaCorpo');
  const txtMinutos = document.getElementById('totalMinutos');
  const txtLicoes = document.getElementById('totalLicoes');
  const txtDias = document.getElementById('totalDias');
  const metaPorcentagemEl = document.getElementById('metaPorcentagem');
  const metaBarraEl = document.getElementById('metaBarra');

  const API = 'http://localhost:3000';

  // recupera usuario logado
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  if (!usuarioLogado || !usuarioLogado.id_usuario) {
    alert('Por favor, faça login para acessar seu progresso.');
    window.location.href = 'login.html';
    return;
  }

  // carregar dados do servidor
  async function carregarProgresso() {
    try {
      const res = await axios.get(`${API}/api/progresso/${usuarioLogado.id_usuario}`);
      renderizar(res.data);
    } catch (err) {
      console.error(err);
      tabela.innerHTML = `<tr><td colspan="5" style="text-align:center;">Falha ao carregar dados do servidor.</td></tr>`;
    }
  }

  // carrega os dados na tabela 
  function renderizar(dados) {
    tabela.innerHTML = '';

    let totalMin = 0;
    let totalLic = 0;
    let minutosHoje = 0;

    const dataHoje = new Date().toISOString().split('T')[0];
    const datasSet = new Set();

    if (!dados || dados.length === 0) {
      tabela.innerHTML = `<tr><td colspan="5" style="text-align:center;">Nenhum registro encontrado.</td></tr>`;
      txtMinutos.textContent = '0 min';
      txtLicoes.textContent = '0';
      txtDias.textContent = '0 dias';
      if (metaPorcentagemEl) metaPorcentagemEl.textContent = '0%';
      if (metaBarraEl) metaBarraEl.style.width = '0%';
      return;
    }

    dados.forEach((item) => {
      const min = Number(item.minutos_praticados || 0);
      const lic = Number(item.licoes_concluidas || 0);
      const dataStr = item.data_registro ? item.data_registro.split('T')[0] : dataHoje;

      totalMin += min;
      totalLic += lic;
      datasSet.add(dataStr);

      if (dataStr === dataHoje) {
        minutosHoje += min;
      }

      const dataFormatada = new Date(dataStr + 'T00:00:00').toLocaleDateString('pt-BR');

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${dataFormatada}</strong></td>
        <td>Módulo ${item.modulo_id}</td>
        <td><span class="badge-minutos">${min} min</span></td>
        <td>${lic} lição(ões)</td>
        <td style="text-align: center;">
          <button class="btn-deletar" data-id="${item.id_progresso}" title="Apagar">
            <i class="fas fa-trash-alt"></i>
          </button>
        </td>
      `;
      tabela.appendChild(tr);
    });

    txtMinutos.textContent = `${totalMin} min`;
    txtLicoes.textContent = totalLic;
    txtDias.textContent = `${datasSet.size} dia(s)`;

    const metaDiaria = 30;
    const pct = Math.min(Math.round((minutosHoje / metaDiaria) * 100), 100);
    if (metaPorcentagemEl) metaPorcentagemEl.textContent = `${pct}%`;
    if (metaBarraEl) metaBarraEl.style.width = `${pct}%`;

    document.querySelectorAll('.btn-deletar').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        apagarRegistro(id);
      });
    });
  }

  // apagar registro
  async function apagarRegistro(id_progresso) {
    if (!confirm('Deseja apagar este registro do histórico?')) return;

    try {
      await axios.delete(`${API}/api/progresso/${id_progresso}`);
      carregarProgresso();
    } catch (err) {
      console.error(err);
      const msgErro = err.response?.data?.message || 'Erro ao excluir registro.';
      alert(msgErro);
    }
  }

  // inicializacao
  carregarProgresso();
});