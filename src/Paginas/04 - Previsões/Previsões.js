import React, { useState, useEffect } from 'react';
import './Previsões.css';

function NovosValores() {
  const [contratos, setContratos] = useState([]);
  const [contratoSelecionado, setContratoSelecionado] = useState(null);

  useEffect(() => {
    const dadosSalvos = localStorage.getItem('contratos');
    if (dadosSalvos) {
      setContratos(JSON.parse(dadosSalvos));
    }
  }, []);

  const parseData = (dataStr) => {
    if (!dataStr) return null;
    if (dataStr.includes('/')) {
      const [dia, mes, ano] = dataStr.split('/');
      return new Date(`${ano}-${mes}-${dia}`);
    }
    return new Date(dataStr);
  };

  const calcularMedicoesPrevistas = (contrato) => {
    if (!contrato || !contrato.dataInicio || !contrato.dataFim || !contrato.valorInicial)
      return { lista: [], meses: 0 };

    const inicio = parseData(contrato.dataInicio);
    const fim = parseData(contrato.dataFim);

    const valorTratado = contrato.valorInicial.replace(/\./g, '').replace(',', '.');
    const valorTotal = parseFloat(valorTratado) || 0;

    const meses =
      (fim.getFullYear() - inicio.getFullYear()) * 12 +
      (fim.getMonth() - inicio.getMonth()) +
      1;
    const valorPorMes = valorTotal / meses;

    const lista = [];
    for (let i = 0; i < meses; i++) {
      const data = new Date(inicio.getFullYear(), inicio.getMonth() + i, 1);
      const mesAno = data.toLocaleDateString('pt-BR', {
        month: 'long',
        year: 'numeric',
      });
      lista.push({ mesAno, valor: valorPorMes });
    }

    return { lista, meses };
  };

  const calcularMediçõesRealizadas = (inicio, fim) => {
    const hoje = new Date();
    const dataInicio = parseData(inicio);
    const dataFim = parseData(fim);

    if (hoje < dataInicio) return 0;
    if (hoje > dataFim) {
      return (
        (dataFim.getFullYear() - dataInicio.getFullYear()) * 12 +
        (dataFim.getMonth() - dataInicio.getMonth()) +
        1
      );
    }

    return (
      (hoje.getFullYear() - dataInicio.getFullYear()) * 12 +
      (hoje.getMonth() - dataInicio.getMonth()) +
      1
    );
  };

  const handleSelecionarContrato = (numeroContrato) => {
    const contrato = contratos.find((c) => c.numero === numeroContrato);
    if (contrato) {
      setContratoSelecionado({ ...contrato });
    }
  };

  const formatarValor = (valor) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const dadosCalculados = contratoSelecionado
    ? calcularMedicoesPrevistas(contratoSelecionado)
    : { lista: [], meses: 0 };

  const medicoes = dadosCalculados.lista;
  const totalMeses = dadosCalculados.meses;

  const medicoesRealizadas = contratoSelecionado
    ? calcularMediçõesRealizadas(
        contratoSelecionado.dataInicio,
        contratoSelecionado.dataFim
      )
    : 0;

  return (
    <div className="novos-valores-container">
      <h2>Controle Financeiro</h2>

      <div className="filtros-novos-valores">
        <h3>Selecione um contrato:</h3>
        <div className="lista-contratos-simples">
          {contratos.map((contrato) => (
            <div
              key={contrato.numero}
              className={`contrato-simples-card ${
                contratoSelecionado?.numero === contrato.numero ? 'ativo' : ''
              }`}
              onClick={() => handleSelecionarContrato(contrato.numero)}
            >
              <strong>{contrato.numero}</strong> — {contrato.contratante}
            </div>
          ))}
        </div>
      </div>

      {contratoSelecionado && (
        <div className="detalhes-contrato-novos-valores">
          <h3>Contrato: {contratoSelecionado.numero}</h3>
          <p>
            <strong>Valor Inicial:</strong>{' '}
            {formatarValor(
              parseFloat(
                contratoSelecionado.valorInicial.replace(/\./g, '').replace(',', '.')
              )
            )}
          </p>
          <p>
            <strong>Período do Contrato:</strong> {contratoSelecionado.dataInicio} até{' '}
            {contratoSelecionado.dataFim}
          </p>
          <p>
            <strong>Total de meses:</strong> {totalMeses}
          </p>
          <p>
            <strong>Medições Realizadas:</strong> {medicoesRealizadas}
          </p>
          <p>
            <strong>Medições Restantes:</strong>{' '}
            {Math.max(totalMeses - medicoesRealizadas, 0)}
          </p>

          <h4>Medições Previstas</h4>
          <table className="tabela-medicoes">
            <thead>
              <tr>
                <th>Mês</th>
                <th>Valor Previsto</th>
              </tr>
            </thead>
            <tbody>
              {medicoes.map((m, i) => (
                <tr key={i}>
                  <td style={{ textTransform: 'capitalize' }}>{m.mesAno}</td>
                  <td>{formatarValor(m.valor)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default NovosValores;
