import React from 'react';
import './Menu.css';

export default function MenuLateral({ paginaAtual, setPaginaAtual, usuarioLogado, onLogout }) {
  return (
    <nav className="sidebar">
      <div className="menu">
        <button
          className={`menu-item ${paginaAtual === 'inicio' ? 'active' : ''}`}
          onClick={() => setPaginaAtual('inicio')}
        >
        Início
        </button>
        <button
          className={`menu-item ${paginaAtual === 'contratos' ? 'active' : ''}`}
          onClick={() => setPaginaAtual('contratos')}
        >
        Contratos
        </button>
        <button
          className={`menu-item ${paginaAtual === 'valores' ? 'active' : ''}`}
          onClick={() => setPaginaAtual('valores')}
        >
        Previsões
        </button>
        <button
          className={`menu-item ${paginaAtual === 'analise' ? 'active' : ''}`}
          onClick={() => setPaginaAtual('analise')}
        >
        Análise de Custos
        </button>

        <div className="menu-section">Módulos</div>

        <button
          className={`menu-item ${paginaAtual === 'operacional' ? 'active' : ''}`}
          onClick={() => setPaginaAtual('operacional')}
        >
        Operacional
        </button>
        <button
          className={`menu-item ${paginaAtual === 'comercial' ? 'active' : ''}`}
          onClick={() => setPaginaAtual('comercial')}
        >
        Comercial
        </button>
      </div>

      <div className="user-area">
        <button className="menu-item logout" onClick={onLogout}>
          Sair
        </button>
      </div>
    </nav>
  );
}
