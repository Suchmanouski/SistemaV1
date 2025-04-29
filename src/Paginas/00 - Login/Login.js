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

  // Avança o slide a cada 4s
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
        if (lembrar) localStorage.setItem('usuarioLogado', JSON.stringify(data));
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
      <div className="login-container__bg">
        {fundos.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`fundo ${i}`}
            className={`login-bg__img ${slideIndex === i ? 'active' : ''}`}
          />
        ))}
      </div>
      <form className="login-form" onSubmit={handleSubmit}>
        <img src={logo} alt="Logo" className="login-form__logo" />
        <h1 className="login-form__title">Bem-vindo(a)</h1>

        <label className="login-form__label">Usuário</label>
        <input
          className="login-form__input"
          type="text"
          value={usuario}
          onChange={e => setUsuario(e.target.value)}
          placeholder="Digite seu usuário"
          required
        />

        <label className="login-form__label">Senha</label>
        <div className="login-form__senha-container">
          <input
            className="login-form__input"
            type={verSenha ? 'text' : 'password'}
            value={senha}
            onChange={e => setSenha(e.target.value)}
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            className="login-form__showpass"
            onClick={() => setVerSenha(v => !v)}
          >
            {verSenha ? '🙈' : '👁️'}
          </button>
        </div>

        <div className="login-form__extras">
          <label>
            <input
              type="checkbox"
              checked={lembrar}
              onChange={e => setLembrar(e.target.checked)}
            />
            Lembrar credenciais
          </label>
          <a href="#" className="login-form__link">Esqueceu sua senha?</a>
        </div>

        {erro && <div className="login-form__error">{erro}</div>}

        <button className="login-form__btn" type="submit">
          ENTRAR
        </button>

        <div className="login-form__signup">
          Ainda não tem conta? <a href="#">Inscrever-se</a>
        </div>
      </form>
    </div>
  );
}
