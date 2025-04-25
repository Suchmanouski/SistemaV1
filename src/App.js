import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Paginas/00 - Login/Teste';
import Pagina01 from './Paginas/01 - Página Incial/Inicio';

function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(() => {
    const user = localStorage.getItem('usuarioLogado');
    return user ? JSON.parse(user) : null;
  });

  const handleLoginSuccess = (resposta) => {
    const usuario = resposta.usuario; // <- Corrigido aqui
    localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
    setUsuarioLogado(usuario);
  };

  const handleLogout = () => {
    localStorage.removeItem('usuarioLogado');
    setUsuarioLogado(null);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            usuarioLogado ? (
              <Navigate to="/inicio" />
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          }
        />
        <Route
          path="/inicio"
          element={
            usuarioLogado ? (
              <Pagina01 usuarioLogado={usuarioLogado} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
