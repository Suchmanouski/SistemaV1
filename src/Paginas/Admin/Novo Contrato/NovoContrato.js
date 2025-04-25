import React, { useState } from 'react';
import './NovoContrato.css';
import axios from 'axios';

function NovoContrato({ token }) {
  const [form, setForm] = useState({
    numero: '',
    contratante: '',
    dataInicio: '',
    dataFim: '',
    valorInicial: ''
  });

  const [mensagem, setMensagem] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem('');

    try {
      await axios.post('/contratos', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMensagem('✅ Contrato cadastrado com sucesso!');
    } catch (err) {
      setMensagem('❌ Erro ao cadastrar contrato.');
    }
  };

  return (
    <div className="novo-contrato-page">
      <div className="novo-contrato-container">
        <h2>Novo Contrato</h2>
        <form className="novo-contrato-form" onSubmit={handleSubmit}>
          <input type="text" name="numero" placeholder="Número do contrato" value={form.numero} onChange={handleChange} required />
          <input type="text" name="contratante" placeholder="Contratante" value={form.contratante} onChange={handleChange} required />
          <input type="date" name="dataInicio" placeholder="Data de início" value={form.dataInicio} onChange={handleChange} required />
          <input type="date" name="dataFim" placeholder="Data de término" value={form.dataFim} onChange={handleChange} required />
          <input type="number" name="valorInicial" placeholder="Valor inicial (R$)" step="0.01" value={form.valorInicial} onChange={handleChange} required />

          <button type="submit">Cadastrar</button>
        </form>
        {mensagem && <p className="mensagem-contrato">{mensagem}</p>}
      </div>
    </div>
  );
}

export default NovoContrato;
