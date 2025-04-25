import React, { useState } from 'react';
import Login from './Paginas/00 - Login/Login';
import Pagina01 from './Paginas/01 - Página Incial/Inicio';

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

  if (!usuarioLogado) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Pagina01 usuarioLogado={usuarioLogado} onLogout={handleLogout} />
  );
}

export default App;
