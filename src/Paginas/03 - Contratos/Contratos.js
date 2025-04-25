import React, { useState, useEffect } from 'react';
import './Contratos.css';

function Contratos() {
  const [contratos, setContratos] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [busca, setBusca] = useState('');
  const [contratoSelecionado, setContratoSelecionado] = useState(null);
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [formulario, setFormulario] = useState({
    numero: '',
    contratante: '',
    estado: '',
    cidade: '',
    gerente: '',
    coordenador: '',
    valorInicial: '',
    dataInicio: '',
    dataFim: '',
    status: '',
    tipo: ''
  });

  const API_BASE = 'https://sistema-v1-backend.onrender.com';
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado')) || {};

  const carregarContratos = () => {
    fetch(`${API_BASE}/api/contratos`, { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then(data => setContratos(data))
      .catch(err => console.error('Erro ao buscar contratos:', err));
  };

  useEffect(() => {
    carregarContratos();
  }, []);

  const formatarData = dataString => {
    if (!dataString) return null;
    const [dia, mes, ano] = dataString.split('/');
    return `${ano}-${mes}-${dia}`;
  };

  const formatarValor = valorString => {
    if (!valorString) return null;
    return parseFloat(valorString.replace(/\./g, '').replace(',', '.'));
  };

  const handleSalvar = () => {
    const payload = {
      ...formulario,
      dataInicio: formatarData(formulario.dataInicio),
      dataFim: formatarData(formulario.dataFim),
      valorInicial: formatarValor(formulario.valorInicial)
    };

    fetch(`${API_BASE}/api/contratos`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then(() => {
        carregarContratos();
        setFormularioAberto(false);
        resetarFormulario();
        setMensagemSucesso('✅ Contrato adicionado com sucesso!');
        setTimeout(() => setMensagemSucesso(''), 3000);
      })
      .catch(err => {
        console.error('Erro ao salvar contrato:', err);
        setMensagemSucesso('❌ Erro ao salvar contrato.');
        setTimeout(() => setMensagemSucesso(''), 3000);
      });
  };

  const handleExcluir = id => {
    fetch(`${API_BASE}/api/contratos/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        carregarContratos();
        setMensagemSucesso('✅ Contrato excluído com sucesso!');
        setTimeout(() => setMensagemSucesso(''), 3000);
      })
      .catch(err => {
        console.error('Erro ao excluir contrato:', err);
        setMensagemSucesso('❌ Erro ao excluir contrato.');
        setTimeout(() => setMensagemSucesso(''), 3000);
      });
  };

  const cancelarFormulario = () => {
    setFormularioAberto(false);
    resetarFormulario();
  };

  const resetarFormulario = () => {
    setFormulario({
      numero: '',
      contratante: '',
      estado: '',
      cidade: '',
      gerente: '',
      coordenador: '',
      valorInicial: '',
      dataInicio: '',
      dataFim: '',
      status: '',
      tipo: ''
    });
  };

  const handleChange = e => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  // Filtra conforme tipo de usuário
  const contratosFiltrados = contratos.filter(ctr => {
    const passaBusca = ctr.numero.toLowerCase().includes(busca.toLowerCase());
    const passaEstado = filtroEstado
      ? ctr.estado?.toLowerCase() === filtroEstado.toLowerCase()
      : true;

    if (usuarioLogado.tipo_usuario === 'admin' || usuarioLogado.tipo_usuario === 'financeiro') {
      return passaBusca && passaEstado;
    }
    if (usuarioLogado.tipo_usuario === 'coordenador') {
      return (
        ctr.numero.toString() === usuarioLogado.contrato.toString() &&
        passaBusca &&
        passaEstado
      );
    }
    return false;
  });

  return (
    <div className="pagina-contratos">
      <div className="barra-contratos-v2">
        <div className="titulo-contratos">Contratos</div>
        <div className="acoes-contratos">
          <input
            type="text"
            placeholder="Buscar por número do contrato..."
            className="campo-busca-contrato"
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
          <button className="btn-novo-contrato" onClick={() => setFormularioAberto(true)}>
            + Novo Contrato
          </button>
        </div>
      </div>

      {mensagemSucesso && <div className="mensagem-sucesso">{mensagemSucesso}</div>}

      <div className="conteudo-contratos">
        <div className="lista-contratos">
          {contratosFiltrados.map(ctr => (
            <div className="contrato-card" key={ctr.id}>
              <strong>{ctr.numero}</strong> – {ctr.contratante}
              <div className="info-criador">
                Criado por {ctr.criador} em {ctr.data_criacao?.split('T')[0]}
              </div>
              <div className="acoes-card">
                <button onClick={() => setContratoSelecionado(ctr)}>Visualizar</button>
                <button className="btn-excluir" onClick={() => handleExcluir(ctr.id)}>
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {contratoSelecionado && (
        <div className="modal-overlay" onClick={() => setContratoSelecionado(null)}>
          <div className="modal-contrato" onClick={e => e.stopPropagation()}>
            <h3>Detalhes do Contrato</h3>
            {Object.entries(contratoSelecionado).map(([key, value]) => (
              <p key={key}>
                <strong>{key}:</strong> {value}
              </p>
            ))}
            <button className="fechar-modal" onClick={() => setContratoSelecionado(null)}>
              Fechar
            </button>
          </div>
        </div>
      )}

      {formularioAberto && (
        <div className="modal-overlay" onClick={cancelarFormulario}>
          <div className="modal-contrato" onClick={e => e.stopPropagation()}>
            <h3>Novo Contrato</h3>
            <div className="formulario-grid">
              {Object.keys(formulario).map(campo => (
                <div key={campo} className="form-group">
                  <label>{campo}</label>
                  <input
                    name={campo}
                    value={formulario[campo]}
                    placeholder={campo}
                    onChange={handleChange}
                  />
                </div>
              ))}
              <div className="botoes-formulario">
                <button className="btn-salvar" onClick={handleSalvar}>
                  Salvar
                </button>
                <button className="fechar-modal" onClick={cancelarFormulario}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Contratos;
