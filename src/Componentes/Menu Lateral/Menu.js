import React from 'react';
import './Menu.css';

export default function MenuLateral({ paginaAtual, setPaginaAtual, usuarioLogado, onLogout }) {
  return (
    <nav className="menu-lateral">
      <button
        className={`menu-item ${paginaAtual === 'inicio' ? 'active' : ''}`}
        onClick={() => setPaginaAtual('inicio')}
      >
        01 - Início
      </button>

      <button
        className={`menu-item ${paginaAtual === 'contratos' ? 'active' : ''}`}
        onClick={() => setPaginaAtual('contratos')}
      >
        03 - Contratos
      </button>

      <button
        className={`menu-item ${paginaAtual === 'valores' ? 'active' : ''}`}
        onClick={() => setPaginaAtual('valores')}
      >
        04 - Previsões
      </button>

      <button
        className={`menu-item ${paginaAtual === 'analise' ? 'active' : ''}`}
        onClick={() => setPaginaAtual('analise')}
      >
        05 - Análise de Custos
      </button>

      {/* Novas seções */}
      <button
        className={`menu-item ${paginaAtual === 'operacional' ? 'active' : ''}`}
        onClick={() => setPaginaAtual('operacional')}
      >
        06 - Operacional
      </button>

      <button
        className={`menu-item ${paginaAtual === 'comercial' ? 'active' : ''}`}
        onClick={() => setPaginaAtual('comercial')}
      >
        07 - Comercial
      </button>

      {/* Logout */}
      {usuarioLogado && (
        <button className="menu-item logout" onClick={onLogout}>
          Sair
        </button>
      )}
    </nav>
  );
}
