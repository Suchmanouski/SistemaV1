import React, { useState } from 'react';
import './Contratos.css';

function Contratos() {
  const [contratos, setContratos] = useState(() => {
    const contratosSalvos = localStorage.getItem('contratos');
    return contratosSalvos ? JSON.parse(contratosSalvos) : [];
  });

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

  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado')) || { tipo_usuario: '' };

  const contratosFiltrados = contratos.filter((contrato) => {
    const passaFiltroEstado = filtroEstado
      ? contrato.estado?.toLowerCase() === filtroEstado.toLowerCase()
      : true;
    const passaBusca = contrato.numero.toLowerCase().includes(busca.toLowerCase());
    return passaFiltroEstado && passaBusca;
  });

  const handleSalvar = () => {
    const novoContrato = {
      ...formulario,
      criador: usuarioLogado.nome || 'Desconhecido',
      dataCriacao: new Date().toLocaleString()
    };
    const novaLista = [...contratos, novoContrato];
    setContratos(novaLista);
    localStorage.setItem('contratos', JSON.stringify(novaLista));
    setFormularioAberto(false);
    resetarFormulario();
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

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleExcluir = (id) => {
    setContratos(contratos.filter((contrato) => contrato.id !== id));
    localStorage.setItem('contratos', JSON.stringify(contratos.filter((contrato) => contrato.id !== id)));
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
            onChange={(e) => setBusca(e.target.value)}
          />
          {/* Botão de Adicionar Contrato apenas visível para Administradores */}
          {usuarioLogado.tipo_usuario === 'admin' && (
            <button className="btn-novo-contrato" onClick={() => setFormularioAberto(true)}>
              + Novo Contrato
            </button>
          )}
        </div>
      </div>

      <div className="conteudo-contratos">
        <div className="lista-contratos">
          {contratosFiltrados.map((contrato, index) => (
            <div className="contrato-card" key={index}>
              <strong>{contrato.numero}</strong> – {contrato.contratante}
              <div className="info-criador">
                Criado por {contrato.criador} em {contrato.dataCriacao}
              </div>
              <div className="acoes-card">
                {/* Exibir ações apenas para Administradores */}
                {usuarioLogado.tipo_usuario === 'admin' && (
                  <div>
                    <button className="btn-editar">Editar</button>
                    <button className="btn-excluir" onClick={() => handleExcluir(contrato.id)}>Excluir</button>
                  </div>
                )}
                <button onClick={() => setContratoSelecionado(contrato)}>Visualizar</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Detalhes do Contrato */}
      {contratoSelecionado && (
        <div className="modal-overlay" onClick={() => setContratoSelecionado(null)}>
          <div className="modal-contrato" onClick={(e) => e.stopPropagation()}>
            <h3>Detalhes do Contrato</h3>
            {Object.entries(contratoSelecionado).map(([key, value]) => (
              <p key={key}><strong>{key}:</strong> {value}</p>
            ))}
            <button className="fechar-modal" onClick={() => setContratoSelecionado(null)}>Fechar</button>
          </div>
        </div>
      )}

      {/* Formulário de Novo Contrato */}
      {formularioAberto && (
        <div className="modal-overlay" onClick={cancelarFormulario}>
          <div className="modal-contrato" onClick={(e) => e.stopPropagation()}>
            <h3>Novo Contrato</h3>
            <div className="formulario-grid">
              {Object.keys(formulario).map((campo) => (
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
