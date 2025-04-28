import React, { useState, useEffect } from 'react';
import './Login.css';
import logo from '../../Imagens/logo.jpg';
import fundo1 from '../../Imagens/1.jpg';
import fundo2 from '../../Imagens/2.jpg';
import fundo3 from '../../Imagens/3.jpg';

export default function Login({ onLoginSuccess }) {
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [verSenha, setVerSenha] = useState(false);
  const [fundoIndex, setFundoIndex] = useState(0);

  const fundos = [fundo1, fundo2, fundo3];

  useEffect(() => {
    const interval = setInterval(
      () => setFundoIndex(i => (i + 1) % fundos.length),
      4000
    );
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async e => {
    e.preventDefault();
    try {
      const res = await fetch('https://sistema-v1-backend.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, senha })
      });
      const data = await res.json();
      if (data.message) setErro(data.message);
      else onLoginSuccess(data);
    } catch {
      setErro('Erro no servidor.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        {fundos.map((img, i) => (
          <img
            key={i}
            src={img}
            className={`login-fundo ${fundoIndex === i ? 'ativo' : ''}`}
            alt={`fundo ${i}`}
          />
        ))}
      </div>
      <div className="login-right">
        <div className="login-box">
          <img src={logo} alt="Logo" className="login-logo" />
          <h1>Grupo Simemp Neoconstec</h1>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Usuário ou Email</label>
              <input
                type="text"
                value={nome}
                onChange={e => setNome(e.target.value)}
                required
              />
            </div>
            <div className="form-group senha-group">
              <label>Senha</label>
              <input
                type={verSenha ? 'text' : 'password'}
                value={senha}
                onChange={e => setSenha(e.target.value)}
                required
              />
              <button
                type="button"
                className="ver-senha-btn"
                onClick={() => setVerSenha(v => !v)}
                aria-label="Mostrar senha"
              >
                {verSenha ? '🙈' : '👁️'}
              </button>
            </div>
            <div className="extras">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  onChange={() => {}}
                />
                Lembrar credenciais
              </label>
              <a href="#" className="link-esqueci">Esqueceu sua senha?</a>
            </div>
            {erro && <div className="erro">{erro}</div>}
            <button type="submit" className="login-btn">ENTRAR</button>
          </form>
        </div>
      </div>
    </div>
  );
}
