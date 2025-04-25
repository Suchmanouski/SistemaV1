import React, { useState, useEffect } from 'react';
import './Login.css';
import logo from '../../Imagens/logo.jpg';
import fundo1 from '../../Imagens/1.jpg';
import fundo2 from '../../Imagens/2.jpg';
import fundo3 from '../../Imagens/3.jpg';
import { useNavigate } from 'react-router-dom';

function Login({ onLoginSuccess }) {
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [verSenha, setVerSenha] = useState(false);
  const [fundoIndex, setFundoIndex] = useState(0);
  const navigate = useNavigate();

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
        if (data.usuario) {
          setErro('');
          onLoginSuccess(data); // salva no App.js
          navigate('/inicio'); // redireciona
        } else {
          setErro(data.message || 'Erro ao fazer login');
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
                👁️
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
