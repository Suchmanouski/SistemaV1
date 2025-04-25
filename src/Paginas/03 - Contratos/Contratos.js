import React, { useState, useEffect } from 'react';
import './Contratos.css';

function Contratos() {
  const [contratos, setContratos] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [busca, setBusca] = useState('');
  const [contratoSelecionado, setContratoSelecionado] = useState(null);
  const [formularioAberto, setFormularioAberto] = useState(false);
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

  useEffect(() => {
    fetch(`${API_BASE}/api/contratos`, { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.text();
      })
      .then(text => {
        try {
          const data = text ? JSON.parse(text) : [];
          setContratos(data);
        } catch (err) {
          console.error('Erro parsing JSON:', err);
          setContratos([]);
        }
      })
      .catch(err => console.error('Erro ao buscar contratos:', err));
  }, []);

  const contratosFiltrados = contratos.filter(contrato => {
    const passaFiltroEstado = filtroEstado
      ? contrato.estado?.toLowerCase() === filtroEstado.toLowerCase()
      : true;
    const passaBusca = contrato.numero?.toLowerCase().includes(busca.toLowerCase());
    return passaFiltroEstado && passaBusca;
  });

  const handleSalvar = () => {
    fetch(`${API_BASE}/api/contratos`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formulario)
    })
      .then(res => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return fetch(`${API_BASE}/api/contratos`, { credentials: 'include' });
      })
      .then(res => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.text();
      })
      .then(text => {
        try {
          const data = text ? JSON.parse(text) : [];
          setContratos(data);
        } catch (err) {
          console.error('Erro parsing JSON pós-inserção:', err);
        }
      })
      .catch(err => console.error('Erro ao salvar contrato:', err))
      .finally(() => {
        setFormularioAberto(false);
        resetarFormulario();
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

      <div className="conteudo-contratos">
        <div className="lista-contratos">
          {contratosFiltrados.map((contrato, index) => (
            <div className="contrato-card" key={index}>
              <strong>{contrato.numero}</strong> – {contrato.contratante}
              <div className="info-criador">
                Criado por {contrato.criador} em {contrato.data_criacao || contrato.dataCriacao}
              </div>
              <div className="acoes-card">
                <button onClick={() => setContratoSelecionado(contrato)}>Visualizar</button>
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
              <p key={key}><strong>{key}:</strong> {value}</p>
            ))}
            <button className="fechar-modal" onClick={() => setContratoSelecionado(null)}>Fechar</button>
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
                <button className="btn-salvar" onClick={handleSalvar}>Salvar</button>
                <button className="fechar-modal" onClick={cancelarFormulario}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Contratos;
