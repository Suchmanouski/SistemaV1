import React, { useState, useEffect, useRef } from 'react';
import './Contratos.css';

function Contratos() {
  const [contratos, setContratos] = useState([]);
  const [busca, setBusca] = useState('');
  const [formulario, setFormulario] = useState({
    numero:'', contratante:'', estado:'', cidade:'',
    gerente:'', coordenador:'', valorInicial:'',
    dataInicio:'', dataFim:'', status:'', tipo:''
  });
  const [mensagem, setMensagem] = useState('');
  const [editarId, setEditarId] = useState(null);
  const [formAberto, setFormAberto] = useState(false);

  const usuario = JSON.parse(sessionStorage.getItem('usuarioLogado'))||{};
  const API = 'https://sistema-v1-backend.onrender.com';

  // paginação
  const [page, setPage] = useState(1);
  const [temMais, setTemMais] = useState(true);
  const carregandoRef = useRef(false);

  const fetchContratos = p => {
    carregandoRef.current = true;
    fetch(`${API}/api/contratos?page=${p}&limit=20`, { credentials:'include' })
      .then(r=>r.json())
      .then(data=>{
        setContratos(prev=> p===1 ? data : [...prev, ...data]);
        if (data.length < 20) setTemMais(false);
      })
      .finally(()=> carregandoRef.current = false);
  };

  useEffect(()=> {
    fetchContratos(1);
    const onScroll = () => {
      if (!temMais || carregandoRef.current) return;
      if (window.innerHeight+window.scrollY >= document.body.offsetHeight-50) {
        setPage(pg=>pg+1);
      }
    };
    window.addEventListener('scroll', onScroll);
    return ()=> window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(()=> {
    if (page>1) fetchContratos(page);
  }, [page]);

  const formatarData = d => {
    if (!d) return null;
    const [day, mon, yr] = d.split('/');
    return `${yr}-${mon}-${day}`;
  };
  const formatarValor = v =>
    v ? parseFloat(v.replace(/\./g,'').replace(',','.')) : null;

  const openForm = (ctr=null)=>{
    if(ctr){
      setEditarId(ctr.id);
      // pré-preenche o form
      const toBR = d => d?.split('T')[0].split('-').reverse().join('/');
      setFormulario({
        numero: ctr.numero,
        contratante: ctr.contratante,
        estado: ctr.estado,
        cidade: ctr.cidade,
        gerente: ctr.gerente,
        coordenador: ctr.coordenador,
        valorInicial: ctr.valor_inicial.toLocaleString('pt-BR',{minimumFractionDigits:2}),
        dataInicio: toBR(ctr.data_inicio),
        dataFim: toBR(ctr.data_fim),
        status: ctr.status,
        tipo: ctr.tipo
      });
    } else {
      setEditarId(null);
      setFormulario({
        numero:'', contratante:'', estado:'', cidade:'',
        gerente:'', coordenador:'', valorInicial:'',
        dataInicio:'', dataFim:'', status:'', tipo:''
      });
    }
    setFormAberto(true);
  };

  const salvar = () => {
    const corpo = {
      ...formulario,
      dataInicio: formatarData(formulario.dataInicio),
      dataFim:    formatarData(formulario.dataFim),
      valorInicial: formatarValor(formulario.valorInicial),
      criador: usuario.nome
    };
    const method = editarId ? 'PUT' : 'POST';
    const url    = editarId ? `${API}/api/contratos/${editarId}` : `${API}/api/contratos`;
    fetch(url, {
      method, credentials:'include',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(corpo)
    })
      .then(r=>r.json())
      .then(()=>{
        setMensagem(editarId?'🚀 Atualizado!':'✅ Criado!');
        fetchContratos(1); setPage(1); setTemMais(true);
        setTimeout(()=>setMensagem(''),3000);
      })
      .finally(()=> setFormAberto(false));
  };

  const excluir = id => {
    fetch(`${API}/api/contratos/${id}`, {
      method:'DELETE', credentials:'include'
    })
      .then(()=> {
        setMensagem('🗑️ Excluído!');
        fetchContratos(1); setPage(1); setTemMais(true);
        setTimeout(()=>setMensagem(''),3000);
      });
  };

  // filtro por tipo de usuário
  const listFiltrada = contratos.filter(c=>{
    if(usuario.tipo_usuario==='coordenador'){
      return c.numero.toString()===usuario.contrato.toString()
        && c.numero.toString().includes(busca);
    }
    return c.numero.toString().includes(busca);
  });

  return (
    <div className="pagina-contratos">
      <div className="barra-contratos-v2">
        <div className="titulo-contratos">Contratos</div>
        <div className="acoes-contratos">
          {/* coordenador pode buscar */}
          {usuario.tipo_usuario==='coordenador' && (
            <input
              placeholder="Buscar..."
              value={busca}
              onChange={e=>setBusca(e.target.value)}
              className="campo-busca-contrato"
            />
          )}
          {/* admin só pode criar */}
          {usuario.tipo_usuario==='admin' && (
            <button className="btn-novo-contrato" onClick={()=>openForm()}>
              + Novo Contrato
            </button>
          )}
        </div>
      </div>

      {mensagem && <div className="mensagem-sucesso">{mensagem}</div>}

      <div className="conteudo-contratos">
        {listFiltrada.map(c=>(
          <div className="contrato-card" key={c.id}>
            <strong>{c.numero}</strong> – {c.contratante}
            <div className="info-criador">
              Criado por {c.criador} em {c.data_criacao.split('T')[0]}
            </div>
            <div className="acoes-card">
              <button onClick={()=>openForm(c)}>Editar</button>
              {usuario.tipo_usuario==='admin' && (
                <button className="btn-excluir" onClick={()=>excluir(c.id)}>
                  Excluir
                </button>
              )}
            </div>
          </div>
        ))}
        {carregandoRef.current && <p>Carregando...</p>}
        {!temMais && <p>— fim —</p>}
      </div>

      {formAberto && (
        <div className="modal-overlay" onClick={()=>setFormAberto(false)}>
          <div className="modal-contrato" onClick={e=>e.stopPropagation()}>
            <h3>{editarId?'Editar':'Novo'} Contrato</h3>
            <div className="formulario-grid">
              {Object.entries(formulario).map(([campo, val])=>(
                <div className="form-group" key={campo}>
                  <label>{campo}</label>
                  <input
                    name={campo}
                    value={val}
                    onChange={e=>setFormulario(f=>({...f,[campo]:e.target.value}))}
                  />
                </div>
              ))}
            </div>
            <div className="botoes-formulario">
              <button className="btn-salvar" onClick={salvar}>
                {editarId?'Atualizar':'Salvar'}
              </button>
              <button className="fechar-modal" onClick={()=>setFormAberto(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Contratos;
