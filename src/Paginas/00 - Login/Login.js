import React, { useState } from 'react';
import './Login.css';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [verSenha, setVerSenha] = useState(false);
  const [lembrar, setLembrar] = useState(false);
  const [erro, setErro] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setErro('');
    try {
      const res = await fetch('https://sistema-v1-backend.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: email, senha })
      });
      const json = await res.json();
      if (res.ok) {
        if (lembrar) localStorage.setItem('usuarioLogado', JSON.stringify(json));
        else sessionStorage.setItem('usuarioLogado', JSON.stringify(json));
        onLoginSuccess(json);
      } else {
        setErro(json.message || 'Erro ao logar');
      }
    } catch {
      setErro('Erro de conexão');
    }
  };

  return (
    <div className="login-page">
      <form className="login-box" onSubmit={handleSubmit}>
        <h1>Grupo Simemp Neoconstec</h1>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="seu@exemplo.com"
          required
        />

        <label htmlFor="senha">Senha</label>
        <div className="senha-wrapper">
          <input
            id="senha"
            type={verSenha ? 'text' : 'password'}
            value={senha}
            onChange={e => setSenha(e.target.value)}
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            className="toggle-senha"
            onClick={() => setVerSenha(v => !v)}
          >
            {verSenha ? '🙈' : '👁️'}
          </button>
        </div>

        <div className="extras">
          <label>
            <input
              type="checkbox"
              checked={lembrar}
              onChange={e => setLembrar(e.target.checked)}
            />
            Lembrar credenciais
          </label>
          <a href="/esqueci-senha" className="link-pequeno">
            Esqueceu sua senha?
          </a>
        </div>

        {erro && <div className="login-erro">{erro}</div>}

        <button type="submit" className="btn-login">
          ENTRAR
        </button>

        <div className="cadastro">
          Ainda não tem conta? <a href="/inscrever-se">Inscrever-se</a>
        </div>
      </form>
    </div>
  );
}

export default Login;
