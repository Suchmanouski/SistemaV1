import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Atualizado para React Router v6
import Login from './Paginas/00 - Login/login'; // Seu componente de Login
import Pagina01 from './Paginas/01 - Página Incial/Inicio'; // Página inicial após o login

function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(() => {
    const user = localStorage.getItem('usuarioLogado');
    return user ? JSON.parse(user) : null;
  });

  const handleLoginSuccess = (usuario) => {
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
        {/* Caso o usuário não esteja logado, redireciona para o login */}
        <Route path="/login" element={usuarioLogado ? <Navigate to="/inicio" /> : <Login onLoginSuccess={handleLoginSuccess} />} />

        {/* Se o usuário estiver logado, redireciona para a página inicial */}
        <Route path="/inicio" element={usuarioLogado ? <Pagina01 usuarioLogado={usuarioLogado} onLogout={handleLogout} /> : <Navigate to="/login" />} />

        {/* Redirecionamento caso o usuário tente acessar uma rota não existente */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
