import React, { useRef, useState, useEffect } from 'react';

import estadosGeoJson from './GeoJSON/estadosBrasil.json';
;
import L from 'leaflet';

const centroDoBrasil = [-15.78, -47.93];

function MapaBrasil({ onEstadoSelecionado = () => {}, contratos = [] }) {
  const mapRef = useRef();
  const [estadoSelecionado, setEstadoSelecionado] = useState(null);

  const quantidadePorEstado = contratos.reduce((acc, contrato) => {
    const estado = contrato.estado;
    if (estado) acc[estado] = (acc[estado] || 0) + 1;
    return acc;
  }, {});

  const getFeatureStyle = (feature) => {
    const isSelected = feature.properties.name === estadoSelecionado;
    return {
      fillColor: isSelected ? '#e53935' : '#64b5f6',
      color: isSelected ? '#e53935' : '#000',
      weight: 1.5,
      opacity: 1,
      fillOpacity: 0.6,
    };
  };

  const onEachEstado = (feature, layer) => {
    const { name } = feature.properties;
    layer.setStyle(getFeatureStyle(feature));
    layer.on({
      click: () => {
        setEstadoSelecionado(name);
        onEstadoSelecionado(name);
      },
      mouseover: (e) => {
        if (name !== estadoSelecionado) {
          e.target.setStyle({
            weight: 2,
            color: '#555',
            fillOpacity: 0.85,
          });
        }
      },
      mouseout: (e) => {
        e.target.setStyle(getFeatureStyle(e.target.feature));
      }
    });

    const quantidade = quantidadePorEstado[name] || 0;
    layer.bindTooltip(
      `<div style="text-align:center;"><strong>${name}</strong><br>${quantidade} contrato(s)</div>`,
      { sticky: true, direction: 'center' }
    );
  };

  useEffect(() => {
    if (mapRef.current) {
      const bounds = L.geoJSON(estadosGeoJson).getBounds();
      mapRef.current.fitBounds(bounds);
    }
  }, []);

   
  
}

export default MapaBrasil;
