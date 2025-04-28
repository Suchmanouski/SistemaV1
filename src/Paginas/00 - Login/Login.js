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
        {fundos.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`fundo ${idx}`}
            className={`login-fundo ${fundoIndex === idx ? 'ativo' : ''}`}
          />
        ))}
      </div>

      <div className="login-right">
        <div className="login-box">
          <img src={logo} alt="Logo" style={{ width: 60, margin: '0 auto 1rem', display: 'block' }}/>
          <h2>Grupo Simemp Neoconstec</h2>
          <form onSubmit={handleLogin}>
            <label>Usuário ou Email</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />

            <label>Senha</label>
            <input
              type={verSenha ? 'text' : 'password'}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />

            <div className="show-password">
              <label>
                <input
                  type="checkbox"
                  checked={verSenha}
                  onChange={() => setVerSenha(!verSenha)}
                />
                Mostrar senha
              </label>
            </div>

            <div className="login-extras">
              <label>
                <input type="checkbox" />
                Lembrar credenciais
              </label>
              <a href="#" className="link-esqueci">Esqueceu sua senha?</a>
            </div>

            {erro && <div className="login-erro">{erro}</div>}

            <button type="submit" className="login-btn">ENTRAR</button>
          </form>

          {/* link de cadastro escondido via CSS */}
          <div className="login-cadastro">
            <a href="#">Ainda não tem conta? Inscrever-se</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
