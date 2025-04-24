import React from 'react';
import './Menu.css';
import logo from '../../Imagens/logo2.png';
import MenuItem from '../Menu Item/MenuItem';
 
function MenuLateral({ paginaAtual, setPaginaAtual, usuarioLogado, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="logo-area">
        <img src={logo} alt="Logo" className="logo" />
        <p className="boas-vindas">Bem-vindo, {usuarioLogado.nome}</p>
      </div>
      <nav className="menu">
        <span className="menu-section">Menu interativo</span>
        <div className="menu-divider" />
        <MenuItem label="Início" page="inicio" paginaAtual={paginaAtual} setPaginaAtual={setPaginaAtual} />
        <MenuItem label="Contratos" page="contratos" paginaAtual={paginaAtual} setPaginaAtual={setPaginaAtual} />
        <MenuItem label="Fluxo de Caixa" page="valores" paginaAtual={paginaAtual} setPaginaAtual={setPaginaAtual} />
        <MenuItem label="Análise de Custo" page="analise" paginaAtual={paginaAtual} setPaginaAtual={setPaginaAtual} />
      </nav>
      <div className="user-area">
        <button onClick={onLogout}>Sair</button>
      </div>
    </aside>
  );
}

export default MenuLateral;
