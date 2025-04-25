import React, { useState } from 'react';
import Login from './Paginas/00 - Login/Login';
import Pagina01 from './Paginas/01 - Página Incial/Inicio';

function App() {
  // Tenta carregar o usuário salvo no localStorage
  const [usuarioLogado, setUsuarioLogado] = useState(() => {
    const saved = localStorage.getItem('usuarioLogado');
    return saved ? JSON.parse(saved) : null;
  });

  // Callback para quando o login for bem-sucedido
  const handleLoginSuccess = (data) => {
    localStorage.setItem('usuarioLogado', JSON.stringify(data));
    setUsuarioLogado(data);
  };

  // Função de logout limpa o localStorage e o state
  const handleLogout = () => {
    localStorage.removeItem('usuarioLogado');
    setUsuarioLogado(null);
  };

  // Se não tiver usuário logado, exibe só o Login
  if (!usuarioLogado) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Caso contrário, renderiza o sistema, passando logout e info do usuário
  return (
    <Pagina01
      usuarioLogado={usuarioLogado}
      onLogout={handleLogout}
    />
  );
}

export default App;
