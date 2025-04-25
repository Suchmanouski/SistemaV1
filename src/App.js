import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // React Router v6
import Login from './Paginas/00 - Login/Teste'; // Componente de Login
import Pagina01 from './Paginas/01 - Página Incial/Inicio'; // Página inicial após o login

function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(() => {
    const user = localStorage.getItem('usuarioLogado');
    return user ? JSON.parse(user) : null;
  });

  const handleLoginSuccess = (resposta) => {
    const usuario = resposta.usuario; // Extrai o objeto 'usuario' da resposta do backend
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
        {/* Redireciona para /inicio se estiver logado, senão mostra a tela de login */}
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

        {/* Página inicial se logado, senão redireciona para login */}
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

        {/* Rota raiz redireciona para login */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
