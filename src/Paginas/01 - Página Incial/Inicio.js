import React, { useState, useEffect } from 'react';
import './Inicio.css';

import Contratos    from '../03 - Contratos/Contratos';
import Previsões    from '../04 - Previsões/Previsões';
import AnaliseCusto from '../05 - Análise de custos/AnaliseCusto';
import Operacional  from '../06 - Operacional/Operacional';
import Comercial    from '../07 - Comercial/Comercial';

import logo         from '../../Imagens/logo2.png';
import MenuLateral  from '../../Componentes/Menu Lateral/Menu';

export default function Pagina01({ usuarioLogado, onLogout }) {
  const [paginaAtual, setPaginaAtual] = useState(() => {
    return localStorage.getItem('paginaAtual') || 'inicio';
  });

  useEffect(() => {
    console.log('Página atual:', paginaAtual);
    localStorage.setItem('paginaAtual', paginaAtual);
  }, [paginaAtual]);
  

  return (
    <div className="dashboard-wrapper">
      <MenuLateral
        paginaAtual={paginaAtual}
        setPaginaAtual={setPaginaAtual}
        usuarioLogado={usuarioLogado}
        onLogout={onLogout}
      />

      <main className="content-area">
        {paginaAtual === 'inicio'      && (
          <div className="powerbi-container">
            <iframe
              src="https://app.powerbi.com/reportEmbed?reportId=1f6ead76-68b1-4ca3-97c8-7976389cdddc&autoAuth=true&ctid=8a1ef6c3-8324-4103-bf4a-1328c5dc3653&navContentPaneEnabled=false&filterPaneEnabled=false"
              title="Relatório Power BI"
              allowFullScreen
            />
          </div>
        )}
        {paginaAtual === 'contratos'   && <Contratos />}
        {paginaAtual === 'valores'     && <Previsões />}
        {paginaAtual === 'analise'     && <AnaliseCusto />}
        {paginaAtual === 'operacional' && <Operacional />}
        {paginaAtual === 'comercial'   && <Comercial />}
      </main>
    </div>
  );
}
