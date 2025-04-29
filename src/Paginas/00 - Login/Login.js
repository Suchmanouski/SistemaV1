import React, { useState, useEffect } from 'react';
import './Login.css';
import fundo1 from '../../Imagens/1.jpg';
import fundo2 from '../../Imagens/2.jpg';
import fundo3 from '../../Imagens/3.jpg';
import logo from '../../Imagens/logo.png';

export default function Login({ onLoginSuccess }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [verSenha, setVerSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [lembrar, setLembrar] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  const fundos = [fundo1, fundo2, fundo3];

  useEffect(() => {
    const iv = setInterval(() => {
      setSlideIndex(i => (i + 1) % fundos.length);
    }, 4000);
    return () => clearInterval(iv);
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch(
        'https://sistema-v1-backend.onrender.com/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome: usuario, senha })
        }
      );
      const data = await res.json();
      if (res.ok) {
        setErro('');
        if (lembrar) 
          localStorage.setItem('usuarioLogado', JSON.stringify(data));
        onLoginSuccess(data);
      } else {
        setErro(data.message);
      }
    } catch {
      setErro('Erro no servidor.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-bg">
        {fundos.map((img, i) => (
          <img
            key={i}
            src={img}
            alt=""
            className={`login-bg__img ${
              slideIndex === i ? 'active' : ''
            }`}
          />
        ))}
      </div>
      <div className="login-panel">
        <form className="login-form" onSubmit={handleSubmit}>
          <img src={logo} alt="Logo" className="login-logo" />
          <h1 className="login-title">Bem-vindo(a)</h1>

          <label className="login-label">Usuário</label>
          <input
            className="login-input"
            type="text"
            value={usuario}
            onChange={e => setUsuario(e.target.value)}
            placeholder="Digite seu usuário"
            required
          />

          <label className="login-label">Senha</label>
          <div className="login-input--senha">
            <input
              className="login-input login-input--has-icon"
              type={verSenha ? 'text' : 'password'}
              value={senha}
              onChange={e => setSenha(e.target.value)}
              placeholder="••••••••"
              required
            />
            <svg
              onClick={() => setVerSenha(v => !v)}
              className="login-icon eye-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              {verSenha ? (
                <path d="M12 5c7 0 11 7 11 7s-4 7-11 7S1 12 1 12s4-7 11-7zm0 2a5 5 0 100 10 5 5 0 000-10z" />
              ) : (
                <path d="M12 9a3 3 0 110 6 3 3 0 010-6zm0-4C7 5 3 9 3 9s4 4 9 4 9-4 9-4-4-4-9-4z" />
              )}
            </svg>
          </div>

          <div className="login-extras">
            <label>
              <input
                type="checkbox"
                checked={lembrar}
                onChange={e => setLembrar(e.target.checked)}
              />
              Lembrar credenciais
            </label>
            <a href="#" className="login-forgot">
              Esqueceu sua senha?
            </a>
          </div>

          {erro && <div className="login-error">{erro}</div>}

          <button type="submit" className="login-btn">
            ENTRAR
          </button>
        </form>
      </div>
    </div>
  );
}
