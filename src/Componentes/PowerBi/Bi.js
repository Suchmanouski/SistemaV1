// src/Componentes/PowerBI/Relatorio.js
import React from 'react';
import './Relatorio.css';

function RelatorioPowerBI() {
  return (
    <div className="powerbi-container">
      <iframe
        src="https://app.powerbi.com/reportEmbed?reportId=1f6ead76-68b1-4ca3-97c8-7976389cdddc&autoAuth=true&ctid=8a1ef6c3-8324-4103-bf4a-1328c5dc3653&navContentPaneEnabled=false&filterPaneEnabled=false"
        title="Relatório Power BI"
        allowFullScreen
      ></iframe>
    </div>
  );
}

export default RelatorioPowerBI;
