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
  const position = [51.505, -0.09];
  
  const sampleGeoJSON = {
    "type": "Feature",
    "properties": {
      "name": "Sample Area",
      "popupContent": "This is a sample GeoJSON polygon"
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [[
        [-0.08, 51.51],
        [-0.06, 51.51],
        [-0.06, 51.49],
        [-0.08, 51.49],
        [-0.08, 51.51]
      ]]
    }
  };

  const markers = [
    { position: [51.505, -0.09], popup: "Main Location" },
    { position: [51.51, -0.1], popup: "Secondary Location" },
    { position: [51.49, -0.08], popup: "Third Location" }
  ];

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer 
        center={position} 
        zoom={13} 
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
              center={[51.508, -0.11]}
              pathOptions={{ fillColor: 'blue', color: 'blue' }}
              radius={200}
            >
              <Popup>Circle overlay showing 200m radius</Popup>
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