import React, { useRef, useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import estadosGeoJson from './GeoJSON/estadosBrasil.json';
import './MapaBrasil.css'; // aqui estão .mapa-wrapper e .leaflet-container

const centroDoBrasil = [-15.78, -47.93];
const zoomInicial = 4;

export default function MapaBrasil({ onEstadoSelecionado = () => {}, contratos = [] }) {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [estadoSelecionado, setEstadoSelecionado] = useState(null);

  // inicializa o mapa
  useEffect(() => {
    if (mapRef.current && !mapInstance) {
      const map = L.map(mapRef.current, {
        center: centroDoBrasil,
        zoom: zoomInicial,
        layers: [
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          })
        ]
      });
      setMapInstance(map);
    }
  }, [mapInstance]);

  // adiciona GeoJSON e eventos
  useEffect(() => {
    if (!mapInstance) return;

    const quantidadePorEstado = contratos.reduce((acc, contrato) => {
      const uf = contrato.estado;
      if (uf) acc[uf] = (acc[uf] || 0) + 1;
      return acc;
    }, {});

    const getFeatureStyle = feature => ({
      fillColor: feature.properties.sigla === estadoSelecionado ? '#e53935' : '#64b5f6',
      color: feature.properties.sigla === estadoSelecionado ? '#e53935' : '#000',
      weight: 1.5,
      fillOpacity: 0.6,
    });

    const onEachEstado = (feature, layer) => {
      layer.setStyle(getFeatureStyle(feature));
      layer.on({
        click: () => {
          setEstadoSelecionado(feature.properties.sigla);
          onEstadoSelecionado(feature.properties.sigla);
        },
        mouseover: e => e.target.setStyle({ weight: 2, fillOpacity: 0.85 }),
        mouseout: e => e.target.setStyle(getFeatureStyle(feature)),
      });

      const qt = quantidadePorEstado[feature.properties.sigla] || 0;
      layer.bindTooltip(
        `<div style="text-align:center;"><strong>${feature.properties.name}</strong><br>${qt} contrato(s)</div>`,
        { sticky: true, direction: 'center' }
      );
    };

    const geoLayer = L.geoJSON(estadosGeoJson, { onEachFeature: onEachEstado }).addTo(mapInstance);
    mapInstance.fitBounds(geoLayer.getBounds());

    return () => mapInstance.removeLayer(geoLayer);
  }, [mapInstance, contratos, estadoSelecionado, onEstadoSelecionado]);

  return (
    <div className="mapa-wrapper">
      {/* este div receberá o CSS com tamanho e borda */}
      <div ref={mapRef} id="mapa-brasil" className="leaflet-container" />
    </div>
  );
}
