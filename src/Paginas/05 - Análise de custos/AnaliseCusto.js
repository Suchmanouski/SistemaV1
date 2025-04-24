import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import './AnaliseCusto.css';

function AnaliseCusto() {
  const [dados, setDados] = useState([]);
  const [devolutiva, setDevolutiva] = useState({});
  const [temporario, setTemporario] = useState({});
  const [nomeArquivo, setNomeArquivo] = useState('');
  const [expandido, setExpandido] = useState(null);
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

  const mapaCoordenadores = {
    'lucas soares lima': '411',
    'andrey debiasi de souza': '3122',
    'luiz sócrates veloso': '3138',
    'marcio herrera': '415'
  };

  useEffect(() => {
    const salvo = localStorage.getItem('planilhaCusto');
    const devol = localStorage.getItem('devolutivaCusto') || '{}';
    const parsedDevolutiva = JSON.parse(devol);

    if (salvo) {
      const json = JSON.parse(salvo);
      setDevolutiva(parsedDevolutiva);

      if (usuario.tipo_usuario === 'coordenador') {
        const contrato = mapaCoordenadores[usuario.nome.trim().toLowerCase()];
        const dadosFiltrados = json.filter(l =>
          l.Departamento?.toString().startsWith(contrato)
        );
        setDados(dadosFiltrados);
      } else {
        setDados(json);
      }
    }
  }, []);

  const handleArquivo = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);

      localStorage.setItem('planilhaCusto', JSON.stringify(json));
      setDados(json);
      setNomeArquivo(file.name);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleCheck = (index) => {
    const contrato = mapaCoordenadores[usuario.nome.trim().toLowerCase()];
    const chave = `${contrato}-${index}`;
    const atual = { ...temporario, [chave]: !temporario[chave] };
    setTemporario(atual);
  };

  const enviarDevolutiva = () => {
    const atual = { ...devolutiva, ...temporario };
    setDevolutiva(atual);
    localStorage.setItem('devolutivaCusto', JSON.stringify(atual));
    setTemporario({});
    alert("Devolutiva enviada com sucesso!");
  };

  const formatarMoeda = (valor) => {
    const num = parseFloat((valor || "0").toString().replace(',', '.'));
    return isNaN(num)
      ? "R$ 0,00"
      : num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const renderCaixasDevolutiva = () => {
    const devol = JSON.parse(localStorage.getItem('devolutivaCusto') || '{}');
    const planilha = JSON.parse(localStorage.getItem('planilhaCusto') || '[]');

    return Object.entries(mapaCoordenadores).map(([nome, contrato]) => {
      const devolutivaContrato = Object.entries(devol)
        .filter(([chave, marcado]) => chave.startsWith(contrato) && marcado)
        .map(([chave]) => {
          const idx = parseInt(chave.split('-')[1]);
          return { ...planilha[idx], idx };
        });

      const temDevol = devolutivaContrato.length > 0;

      return (
        <div key={contrato} className="caixa-financeiro" onClick={() => setExpandido(expandido === contrato ? null : contrato)}>
          <div className="cabecalho-caixa">
            <strong>Contrato:</strong> {contrato} | <strong>Coordenador:</strong> {nome}
            <span className={temDevol ? 'status-vermelho' : 'status-verde'}>
              {temDevol ? 'Devolutiva Recebida' : 'Sem Devolutiva'}
            </span>
          </div>

          {expandido === contrato && (
            <div className="detalhes-devolutiva">
              {devolutivaContrato.length === 0 ? (
                <p><i>Nenhum item marcado.</i></p>
              ) : (
                <div className="itens-devolutiva">
                  {devolutivaContrato.map((item, i) => (
                    <div key={i} className="item-box">
                      <p><strong>Categoria:</strong> {item.Categoria || 'Sem info'}</p>
                      <p><strong>Valor:</strong> {formatarMoeda(item['Valor Rateio'])}</p>
                      <p><strong>Observação:</strong> {item.Observação || '-'}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="analise-container">
      <div className="cabecalho-analise">
  <h2>Análise de Custo</h2>
  {usuario.tipo_usuario === 'coordenador' && (
    <button onClick={enviarDevolutiva} className="btn-enviar-devolutiva">
      Enviar Devolutiva
    </button>
  )}
</div>

{(usuario.tipo_usuario === 'admin' || usuario.tipo_usuario === 'financeiro') && (
  <>
    <label className="upload-label">
      <input type="file" accept=".xlsx,.xls" onChange={handleArquivo} className="upload-input" />
      📂 Enviar Planilha (.xlsx)
    </label>
    {renderCaixasDevolutiva()}
  </>
)}

      {dados.length > 0 && usuario.tipo_usuario === 'coordenador' && (
        <>
          <table className="tabela-analise">
            <thead>
              <tr>
                {Object.keys(dados[0]).map((key, i) => (
                  <th key={i}>{key}</th>
                ))}
                <th>Desconheço</th>
              </tr>
            </thead>
            <tbody>
              {dados.map((linha, i) => {
                const contrato = mapaCoordenadores[usuario.nome?.toLowerCase()];
                const chave = `${contrato}-${i}`;
                const marcado = temporario[chave];
                return (
                  <tr key={i} className={marcado ? 'linha-erro' : ''}>
                    {Object.entries(linha).map(([key, valor], j) => (
                      <td key={j}>
                        {key.toLowerCase().includes('valor') ? formatarMoeda(valor) : valor}
                      </td>
                    ))}
                    <td>
                      <input
                        type="checkbox"
                        checked={marcado || false}
                        onChange={() => handleCheck(i)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <button onClick={enviarDevolutiva} className="btn-enviar-devolutiva">
            Enviar Devolutiva
          </button>
        </>
      )}
    </div>
  );
}

export default AnaliseCusto;
