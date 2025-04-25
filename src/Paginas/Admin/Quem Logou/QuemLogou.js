import React, { useEffect, useState } from 'react';
import './QuemLogou.css';
import axios from 'axios';

function QuemLogou({ token }) {
  const [logs, setLogs] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get('/logs', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLogs(response.data);
      } catch (err) {
        console.error('Erro ao buscar logs:', err);
        setErro('Erro ao carregar logs de atividade.');
      }
    };

    fetchLogs();
  }, [token]);

  return (
    <div className="logs-page">
      <div className="logs-container">
        <h2>Atividades Recentes</h2>

        {erro && <p style={{ color: 'red', textAlign: 'center' }}>{erro}</p>}

        {logs.length === 0 ? (
          <p style={{ textAlign: 'center' }}>Nenhuma atividade registrada ainda.</p>
        ) : (
          <table className="logs-table">
            <thead>
              <tr>
                <th>Usuário</th>
                <th>Ação</th>
                <th>Detalhes</th>
                <th>IP</th>
                <th>Data/Hora</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={index}>
                  <td>{log.usuario}</td>
                  <td>{log.acao}</td>
                  <td>{log.detalhes}</td>
                  <td>{log.ip}</td>
                  <td>{new Date(log.data).toLocaleString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default QuemLogou;
