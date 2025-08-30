import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, LayersControl, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.divIcon({
  className: 'custom-div-icon',
  html: "<div style='background-color:#4285f4;width:12px;height:12px;border-radius:50%;border:3px solid white;'></div>",
});

L.Marker.prototype.options.icon = DefaultIcon;

const HeatmapLayer = ({ data }) => {
  const map = useMap();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const heat = L.heatLayer(data, {
      radius: 25,
      blur: 55,
      maxZoom: 10,
      gradient: {0: 'red', 0.5: 'yellow', 0.9: 'green', 1: 'green'}
    }).addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [map, data]);

  return null;
};

const App = () => {
  const position = [-20.9176, 142.7028];
  const [showMethodologyDialog, setShowMethodologyDialog] = useState(false);
  
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

  // Generate 5km grid for Queensland (approximately 0.045° spacing)
  const generateGridData = () => {
    const grid = [];
    const latStart = -29; // Southern boundary of Queensland
    const latEnd = -10;   // Northern boundary of Queensland
    const lonStart = 138; // Western boundary of Queensland
    const lonEnd = 154;   // Eastern boundary of Queensland
    const spacing = 0.045; // Approximately 0.5km spacing
    
    for (let lat = latStart; lat <= latEnd; lat += spacing) {
      for (let lon = lonStart; lon <= lonEnd; lon += spacing) {
        // Generate random intensity value between 0.3 and 0.9
        const intensity = Math.random();
        grid.push([lat, lon, intensity]);
      }
    }
    return grid;
  };

  const heatmapData = generateGridData();

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
        Data Centre Compass
      </div>
      <div style={{ 
        position: 'absolute', 
        bottom: '20px', 
        left: '20px', 
        zIndex: 1000, 
        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
        padding: '8px 12px', 
        borderRadius: '6px', 
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        fontSize: '14px',
        color: '#333',
        cursor: 'pointer',
        border: '1px solid #ccc',
        transition: 'background-color 0.2s'
      }}
      onClick={() => setShowMethodologyDialog(true)}
      onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(240, 240, 240, 0.9)'}
      onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'}
      >
        Methodology
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

          <LayersControl.Overlay name="Data Intensity Heatmap">
            <HeatmapLayer data={heatmapData} />
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
      
      {showMethodologyDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Dialog Header */}
            <div style={{
              padding: '20px 30px',
              borderBottom: '1px solid #e0e0e0',
              borderRadius: '10px 10px 0 0'
            }}>
              <h2 style={{ 
                margin: '0', 
                fontSize: '24px', 
                fontWeight: 'bold',
                color: '#333'
              }}>
                Scoring Methodology
              </h2>
            </div>

            {/* Dialog Body */}
            <div style={{ 
              padding: '20px 30px',
              flex: '1',
              overflow: 'auto',
              lineHeight: '1.6',
              color: '#666'
            }}>
              <h3 style={{ color: '#333', marginBottom: '15px', fontSize: '18px' }}>Methodology for Data Centre Site Selection</h3>
              <p style={{ marginBottom: '15px' }}>
                To identify optimal locations for data centres in Queensland, a multi-criteria evaluation (MCE) model was developed by analysing open government spatial data.
              </p>

              <h4 style={{ color: '#333', marginBottom: '10px', fontSize: '16px' }}>1. Data Preparation and Analysis</h4>
              <p style={{ marginBottom: '15px' }}>
                The initial datasets were aligned to a common cartographic projection to ensure spatial accuracy. For the Minimum Viable Product (MVP), the analysis was focused on the South East Queensland (SEQ) region, covering 23 Local Government Areas (LGAs).
              </p>

              <h4 style={{ color: '#333', marginBottom: '10px', fontSize: '16px' }}>2. Scoring of Suitability Factors</h4>
              <p style={{ marginBottom: '10px' }}>Each factor was assigned a score on a scale of 1 (least suitable) to 10 (most suitable).</p>
              
              <p style={{ marginBottom: '10px' }}><strong>Energy Supply (Substations):</strong> Proximity to substations is a key factor. Buffer zones were created to define both an "ideal" connection zone (100-1,000 m, 10 points) and a "setback" zone (0-100 m, 1 point) to ensure safety and security.</p>
              
              <p style={{ marginBottom: '10px' }}><strong>Energy Supply (Transmission Lines):</strong> Proximity to high-voltage transmission lines is also important. Zones within 1 km were awarded 10 points, with the score decreasing to 2 points at a distance of 40 km.</p>
              
              <p style={{ marginBottom: '10px' }}><strong>Transport Access:</strong> To assess logistics and personnel access, proximity to major roads was analysed. Zones within 500 m received 10 points.</p>
              
              <p style={{ marginBottom: '15px' }}><strong>Operational Expenditure (Temperature):</strong> To minimise cooling costs, mean annual temperature data was used. Through raster reclassification, areas with the lowest temperatures were assigned the maximum score (10 points).</p>

              <h4 style={{ color: '#333', marginBottom: '10px', fontSize: '16px' }}>3. Risk Assessment and Constraints</h4>
              <p style={{ marginBottom: '10px' }}>To exclude unsuitable areas, mask layers were created from official data sources. Locations falling within these hazard zones received a coefficient of 0 in the final formula.</p>
              <p style={{ marginBottom: '10px' }}><strong>Flood Risk:</strong> The Queensland Floodplain Assessment Overlay was used.</p>
              <p style={{ marginBottom: '15px' }}><strong>Bushfire Risk:</strong> Data from Historical Bushfire Boundaries was used.</p>

              <h4 style={{ color: '#333', marginBottom: '10px', fontSize: '16px' }}>4. Final Evaluation Formula</h4>
              <p style={{ marginBottom: '10px' }}>The final score for each point on the map was calculated using a weighted sum. The weights (coefficients) were assigned based on the importance of each factor for a data centre:</p>
              <ul style={{ marginBottom: '10px', paddingLeft: '20px' }}>
                <li>Proximity to Substations: 35%</li>
                <li>Proximity to Transmission Lines: 15%</li>
                <li>Transport Access: 25%</li>
                <li>Mean Annual Temperature: 25%</li>
              </ul>
              <p style={{ marginBottom: '15px', fontStyle: 'italic', backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
                <strong>Final Formula:</strong><br/>
                Final Score = (Flood_Filter * Bushfire_Filter) * ((Substation_Score * 0.35) + (Transmission_Line_Score * 0.15) + (Major_Road_Score * 0.25) + (Temperature_Score * 0.25))
              </p>

              <h4 style={{ color: '#333', marginBottom: '10px', fontSize: '16px' }}>5. Final Output</h4>
              <p style={{ marginBottom: '15px' }}>
                The result of the analysis is presented as a uniform point grid layer. Each point in the attribute table contains the final suitability score, allowing the results to be easily visualised as a heatmap for an intuitive identification of the most promising zones.
              </p>

              <h4 style={{ color: '#333', marginBottom: '10px', fontSize: '16px' }}>6. Future Development</h4>
              <p style={{ marginBottom: '10px' }}>The model is flexible and scalable. For future development, we recommend:</p>
              <ul style={{ marginBottom: '15px', paddingLeft: '20px' }}>
                <li>Integrating renewable energy sources (solar, wind farms) as a suitability factor.</li>
                <li>Assessing resource availability for cooling systems (e.g., proximity to water sources).</li>
                <li>Expanding the risk analysis to include seismic hazard data and land use restriction zones (e.g., aerodromes, protected areas).</li>
                <li>Conducting detailed site-level analysis, incorporating cadastral data (DCDB), land pricing, land ownership, and approval procedures.</li>
              </ul>

              <p style={{ marginBottom: '15px', fontWeight: 'bold' }}>
                Tools: All spatial analysis, from data processing to the final calculation, was performed using the free and open-source software QGIS.
              </p>
            </div>

            {/* Dialog Footer */}
            <div style={{
              padding: '15px 30px',
              borderTop: '1px solid #e0e0e0',
              borderRadius: '0 0 10px 10px',
              textAlign: 'right',
              backgroundColor: '#f9f9f9'
            }}>
              <button
                onClick={() => setShowMethodologyDialog(false)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;