// Coloque este arquivo em src/Componentes/MapaBrasil/MapaBrasil.jsx
import React, { useRef, useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import estadosGeoJson from './GeoJSON/estadosBrasil.json';
import './MapaBrasil.css';

const centroDoBrasil = [-15.78, -47.93];
const zoomInicial = 4;

export default function MapaBrasil({ onEstadoSelecionado = () => {}, contratos = [] }) {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [estadoSelecionado, setEstadoSelecionado] = useState(null);

  useEffect(() => {
    if (mapRef.current && !mapInstance) {
      const map = L.map(mapRef.current, {
        center: centroDoBrasil,
        zoom: zoomInicial,
        layers: [
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          })
        ],
        zoomControl: false
      });
      setMapInstance(map);
    }
  }, [mapInstance]);

  useEffect(() => {
    if (!mapInstance) return;

    const quantidadePorEstado = contratos.reduce((acc, c) => {
      const uf = c.estado;
      if (uf) acc[uf] = (acc[uf] || 0) + 1;
      return acc;
    }, {});

    const getStyle = feature => ({
      fillColor: feature.properties.sigla === estadoSelecionado ? '#e53935' : '#64b5f6',
      color: feature.properties.sigla === estadoSelecionado ? '#e53935' : '#000',
      weight: 1.5,
      fillOpacity: 0.6
    });

    const onEach = (feature, layer) => {
      layer.setStyle(getStyle(feature));
      layer.on({
        click: () => {
          setEstadoSelecionado(feature.properties.sigla);
          onEstadoSelecionado(feature.properties.sigla);
        },
        mouseover: e => e.target.setStyle({ weight: 2, fillOpacity: 0.85 }),
        mouseout: e => e.target.setStyle(getStyle(feature))
      });
      const qt = quantidadePorEstado[feature.properties.sigla] || 0;
      layer.bindTooltip(`<strong>${feature.properties.name}</strong><br>${qt} contrato(s)`, { sticky: true });
    };

    const geoLayer = L.geoJSON(estadosGeoJson, { onEachFeature: onEach }).addTo(mapInstance);
    mapInstance.fitBounds(geoLayer.getBounds());
    return () => mapInstance.removeLayer(geoLayer);
  }, [mapInstance, contratos, estadoSelecionado, onEstadoSelecionado]);

  return <div className="mapa-wrapper" ref={mapRef} />;
}
