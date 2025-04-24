import React from 'react';
import './MenuItem.css'; // opcional

function MenuItem({ label, page, paginaAtual, setPaginaAtual }) {
  return (
    <button
      className={`menu-item ${paginaAtual === page ? 'active' : ''}`}
      onClick={() => setPaginaAtual(page)}
    >
      {label}
    </button>
  );
}

export default MenuItem;
