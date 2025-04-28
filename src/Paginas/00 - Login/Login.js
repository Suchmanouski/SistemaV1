import React, { useState, useEffect } from 'react';
import './Login.css';
import logo from '../../Imagens/logo.jpg';
import fundo1 from '../../Imagens/1.jpg';
import fundo2 from '../../Imagens/2.jpg';
import fundo3 from '../../Imagens/3.jpg';

function Login({ onLoginSuccess }) {
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [verSenha, setVerSenha] = useState(false);
  const [lembrar, setLembrar] = useState(false);
  const [fundoIndex, setFundoIndex] = useState(0);

  const fundos = [fundo1, fundo2, fundo3];

  useEffect(() => {
    const interval = setInterval(() => {
      setFundoIndex((prev) => (prev + 1) % fundos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async e => {
    e.preventDefault();
    setErro('');
    try {
      const res = await fetch('https://sistema-v1-backend.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, senha })
      });
      const data = await res.json();
      if (!res.ok) {
        setErro(data.message || 'Erro ao logar');
      } else {
        if (lembrar) localStorage.setItem('usuarioLogado', JSON.stringify(data));
        else sessionStorage.setItem('usuarioLogado', JSON.stringify(data));
        onLoginSuccess(data);
      }
    } catch {
      setErro('Erro de conexão');
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        {fundos.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt=""
            className={`login-fundo ${fundoIndex === idx ? 'ativo' : ''}`}
          />
        ))}
      </div>

      <div className="login-right">
        <div className="login-box">
          <img src={logo} alt="Logo" className="login-logo" />
          <h2>Grupo Simemp Neoconstec</h2>

          <form onSubmit={handleLogin}>
            <label htmlFor="nome">Usuario ou Email</label>
            <input
              id="nome"
              type="text"
              placeholder="Digite seu usuário"
              value={nome}
              onChange={e => setNome(e.target.value)}
              required
            />

            <label htmlFor="senha">Senha</label>
            <div className="senha-container">
              <input
                id="senha"
                type={verSenha ? 'text' : 'password'}
                placeholder="••••••"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-icone"
                onClick={() => setVerSenha(v => !v)}
              >
                {verSenha ? '🙈' : '👁️'}
              </button>
            </div>

            {erro && <div className="login-erro">{erro}</div>}

            <div className="login-extras">
              <label>
                <input
                  type="checkbox"
                  checked={lembrar}
                  onChange={e => setLembrar(e.target.checked)}
                />
                Lembrar credenciais
              </label>
              <a href="#" className="link-esqueci">
                Esqueceu sua senha?
              </a>
            </div>

            <button type="submit" className="login-btn">
              ENTRAR
            </button>
          </form>

          <div className="login-cadastro">
            Ainda não tem conta? <a href="#">Inscrever-se</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
