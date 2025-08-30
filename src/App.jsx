import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, LayersControl, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.divIcon({
  className: 'custom-div-icon',
  html: "<div style='background-color:#4285f4;width:12px;height:12px;border-radius:50%;border:3px solid white;'></div>",
});

L.Marker.prototype.options.icon = DefaultIcon;

const App = () => {
  const position = [-20.9176, 142.7028];
  
  const sampleGeoJSON = {
    "type": "Feature",
    "properties": {
      "name": "Sample Area",
      "popupContent": "This is a sample GeoJSON polygon"
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [[
        [153.0, -27.5],
        [153.1, -27.5],
        [153.1, -27.4],
        [153.0, -27.4],
        [153.0, -27.5]
      ]]
    }
  };

  const markers = [
    { position: [-27.4705, 153.0260], popup: "Here will be the most desirable location of the data center" },
    { position: [-19.2590, 146.8169], popup: "Secondary location " },
    { position: [-16.9186, 145.7781], popup: "Third Location" },
  ];

  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
      <div style={{ 
        position: 'absolute', 
        top: '20px', 
        left: '50%', 
        transform: 'translateX(-50%)', 
        zIndex: 1000, 
        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
        padding: '10px 20px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#333'
      }}>
        Data Center Compass
      </div>
      <div style={{ 
        position: 'absolute', 
        bottom: '20px', 
        right: '20px', 
        zIndex: 1000, 
        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
        padding: '8px 12px', 
        borderRadius: '6px', 
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        fontSize: '12px',
        color: '#666'
      }}>
        Designed by Dual Core team for Govhack 2025
      </div>
      <MapContainer 
        center={position} 
        zoom={6} 
        style={{ height: '100%', width: '100%' }}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
          
          <LayersControl.BaseLayer name="Terrain">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.Overlay checked name="Markers">
            <>
              {markers.map((marker, index) => (
                <Marker key={index} position={marker.position}>
                  <Popup>{marker.popup}</Popup>
                </Marker>
              ))}
            </>
          </LayersControl.Overlay>

          <LayersControl.Overlay name="Circle Area">
            <Circle
              center={[-27.4705, 153.0260]}
              pathOptions={{ fillColor: 'blue', color: 'blue' }}
              radius={20000}
            >
              <Popup>Circle overlay showing 20km radius</Popup>
            </Circle>
          </LayersControl.Overlay>

          <LayersControl.Overlay name="GeoJSON Area">
            <GeoJSON
              data={sampleGeoJSON}
              style={() => ({
                color: '#ff7800',
                weight: 2,
                fillColor: '#ff7800',
                fillOpacity: 0.2
              })}
            >
              <Popup>Sample GeoJSON polygon</Popup>
            </GeoJSON>
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    </div>
  );
};

export default App;