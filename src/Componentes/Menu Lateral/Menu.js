import React from 'react';
import './Menu.css';

export default function MenuLateral({ paginaAtual, setPaginaAtual, usuarioLogado, onLogout }) {
  return (
    <nav className="sidebar">
      {/* Logo e boas-vindas (se necessário) */}
      <div className="logo-area">
        <img src="../../Imagens/logo2.png" alt="Logo" className="logo" />
      </div>
      <div className="boas-vindas">Bem-vindo(a), {usuarioLogado.nome}</div>

      {/* Itens do menu */}
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

        {/* Novos botões */}
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

      {/* Logout */}
      <div className="user-area">
        <button className="menu-item logout" onClick={onLogout}>
          Sair
        </button>
      </div>
    </nav>
  );
}
