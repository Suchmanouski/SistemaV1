import React, { useState, useEffect } from 'react';
import './Teste.css';
import logo from '../../Imagens/logo.png';
import fundo1 from '../../Imagens/1.jpg';
import fundo2 from '../../Imagens/2.jpg';
import fundo3 from '../../Imagens/3.jpg';

function Login({ onLoginSuccess }) {
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [verSenha, setVerSenha] = useState(false);
  const [fundoIndex, setFundoIndex] = useState(0);

  const fundos = [fundo1, fundo2, fundo3];

  useEffect(() => {
    const interval = setInterval(() => {
      setFundoIndex((prev) => (prev + 1) % fundos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    fetch('https://sistema-v1-backend.onrender.com/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, senha }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setErro(data.message);
        } else {
          setErro('');
          onLoginSuccess(data);
        }
      })
      .catch(() => setErro('Erro no servidor.'));
  };

  return (
    <div className="login-page">
      <div className="login-left">
        {fundos.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`fundo ${index}`}
            className={`login-fundo ${fundoIndex === index ? 'ativo' : ''}`}
          />
        ))}
      </div>

      <div className="login-right">
        <div className="login-box">
          <img src={logo} alt="Logo" className="login-logo" />
          <h2>Grupo Simemp Neoconstec</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Usuário"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
            <div className="senha-container">
              <input
                type={verSenha ? 'text' : 'password'}
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
              <span
                className="toggle-icone"
                onClick={() => setVerSenha(!verSenha)}
              >
                {verSenha ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="#444" viewBox="0 0 24 24">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c.7 1.81 1.85 3.45 3.36 4.75L2 21l1.5 1.5 3.75-3.75c1.55.56 3.2.75 4.75.75 5 0 9.27-3.11 11-7.5-.7-1.81-1.85-3.45-3.36-4.75L22 3l-1.5-1.5L17 6.25C15.45 5.69 13.8 5.5 12 5.5zM12 8c2.21 0 4 1.79 4 4 0 .68-.18 1.31-.5 1.86l-1.36-1.36c.06-.17.1-.35.1-.5 0-1.1-.9-2-2-2-.15 0-.33.04-.5.1L9.14 9.5c.55-.32 1.18-.5 1.86-.5zM4.91 6.26 6.34 7.7C5.06 8.67 4 10.22 4 12c0 1.78 1.06 3.33 2.34 4.3l1.43 1.44C6.59 17.86 5.37 17 4 17c0-3.86 3.14-7 7-7 1.37 0 2.59.86 3.01 2.05l1.43 1.43C15.33 14.94 13.78 16 12 16c-1.78 0-3.33-1.06-4.3-2.34L6.26 13.1 4.91 6.26z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="#444" viewBox="0 0 24 24">
                    <path d="M12 4.5c-5 0-9.27 3.11-11 7.5.7 1.81 1.85 3.45 3.36 4.75l-1.36 1.36 1.5 1.5 1.36-1.36C8.55 20.31 10.2 20.5 12 20.5c5 0 9.27-3.11 11-7.5-.7-1.81-1.85-3.45-3.36-4.75L22 3l-1.5-1.5L17 6.25C15.45 5.69 13.8 5.5 12 5.5zM12 8c-2.21 0-4 1.79-4 4 0 .68.18 1.31.5 1.86l1.36-1.36c-.06-.17-.1-.35-.1-.5 0-1.1.9-2 2-2 .15 0 .33.04.5.1l1.36-1.36C13.33 8.18 12.68 8 12 8z" />
                  </svg>
                )}
              </span>
            </div>
            {erro && <p className="login-error">{erro}</p>}
            <button type="submit" className="login-btn">
              Entrar
            </button>
          </form>
          <div className="esqueci-senha">
            <a href="#">Esqueceu a senha?</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
