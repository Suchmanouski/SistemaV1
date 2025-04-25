import React, { useState } from 'react';
import Login from './Paginas/00 - Login/Login';
import Pagina01 from './Paginas/01 - Página Incial/Inicio';

function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(() => {
    const user = localStorage.getItem('usuarioLogado');
    return user ? JSON.parse(user) : null;
  });

  const handleLoginSuccess = (usuario) => {
    // Salva o usuário e o token no localStorage
    localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
    localStorage.setItem('token', usuario.token);
    setUsuarioLogado(usuario);
  };

  const handleLogout = () => {
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('token');
    setUsuarioLogado(null);
  };

  if (!usuarioLogado) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Pagina01
      usuarioLogado={usuarioLogado}
      token={localStorage.getItem('token')}
      onLogout={handleLogout}
    />
  );
}

export default App;
