import React, { useState } from 'react';
import './NovoUsuario.css'; // use o mesmo estilo do login
import axios from 'axios';

function NovoUsuario({ token }) {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    tipo_usuario: 'coordenador',
    contrato: ''
  });

  const [mensagem, setMensagem] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem('');

    try {
      await axios.post('/usuarios', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMensagem('✅ Usuário cadastrado com sucesso!');
    } catch (err) {
      setMensagem('❌ Erro ao cadastrar usuário.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-right">
        <div className="login-box">
          <h2>Novo Usuário</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" name="nome" placeholder="Nome" onChange={handleChange} required />
            <input type="email" name="email" placeholder="E-mail" onChange={handleChange} required />
            <input type="password" name="senha" placeholder="Senha" onChange={handleChange} required />
            <select name="tipo_usuario" onChange={handleChange}>
              <option value="coordenador">Coordenador</option>
              <option value="admin">Admin</option>
            </select>
            <input type="text" name="contrato" placeholder="Contrato (se houver)" onChange={handleChange} />

            <button className="login-btn" type="submit">Cadastrar</button>
          </form>
          {mensagem && <p className="login-error">{mensagem}</p>}
        </div>
      </div>

      <div className="login-left">
        <img className="login-fundo ativo" src="/Imagens/login.jpg" alt="Fundo" />
      </div>
    </div>
  );
}

export default NovoUsuario;
