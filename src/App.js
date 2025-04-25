import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Login from './Paginas/00 - Login/Login'; // Seu componente de Login
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
      <Switch>
        {/* Caso o usuário não esteja logado, redireciona para o login */}
        <Route path="/login">
          {usuarioLogado ? <Redirect to="/inicio" /> : <Login onLoginSuccess={handleLoginSuccess} />}
        </Route>

        {/* Se o usuário estiver logado, redireciona para a página inicial */}
        <Route path="/inicio">
          {usuarioLogado ? <Pagina01 usuarioLogado={usuarioLogado} onLogout={handleLogout} /> : <Redirect to="/login" />}
        </Route>

        {/* Redirecionamento caso o usuário tente acessar uma rota não existente */}
        <Route path="/">
          <Redirect to="/login" />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
