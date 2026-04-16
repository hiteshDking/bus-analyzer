import { useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Bus locations data
const busLocations = [
  { 
    id: 1, 
    name: "Airport Express", 
    busNumber: "A-101",
    lat: 28.6139, 
    lng: 77.2090, 
    passengers: 42, 
    status: "Active",
    nextStop: "Terminal 3",
    arrivalTime: "5 min"
  },
  { 
    id: 2, 
    name: "Downtown Shuttle", 
    busNumber: "D-202",
    lat: 28.6180, 
    lng: 77.2200, 
    passengers: 38, 
    status: "On Time",
    nextStop: "City Center",
    arrivalTime: "8 min"
  },
  { 
    id: 3, 
    name: "University Line", 
    busNumber: "U-303",
    lat: 28.6100, 
    lng: 77.2300, 
    passengers: 25, 
    status: "Active",
    nextStop: "Main Campus",
    arrivalTime: "3 min"
  },
  { 
    id: 4, 
    name: "Metro Circular", 
    busNumber: "M-404",
    lat: 28.6250, 
    lng: 77.2150, 
    passengers: 35, 
    status: "Delayed",
    nextStop: "Central Station",
    arrivalTime: "12 min"
  },
];

function BusMap() {
  const mapRef = useRef(null);
  const [trackingMessage, setTrackingMessage] = useState(null);

  const trackBus = (bus) => {
    // Center map on the bus
    if (mapRef.current) {
      mapRef.current.flyTo([bus.lat, bus.lng], 15, {
        duration: 1.5
      });
    }
    
    // Show tracking message
    setTrackingMessage({
      bus: bus.name,
      message: `📍 Now tracking ${bus.name} (${bus.busNumber}) | Next stop: ${bus.nextStop} | Arrival: ${bus.arrivalTime} | Passengers: ${bus.passengers}`
    });
    
    // Hide message after 5 seconds
    setTimeout(() => setTrackingMessage(null), 5000);
  };

  const center = [28.6139, 77.2090];

  return (
    <div className="bus-map-container">
      <h3>📍 Live Bus Locations - Click any bus marker to track it</h3>
      
      {/* Tracking message banner */}
      {trackingMessage && (
        <div className="tracking-banner">
          <div className="tracking-content">
            <span className="tracking-icon">📍</span>
            <span className="tracking-text">{trackingMessage.message}</span>
          </div>
        </div>
      )}
      
      <MapContainer 
        ref={mapRef}
        center={center} 
        zoom={13} 
        style={{ height: "450px", width: "100%", borderRadius: "16px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {busLocations.map((bus) => (
          <Marker key={bus.id} position={[bus.lat, bus.lng]}>
            <Popup>
              <div className="map-popup">
                <div className="popup-header">
                  <span className="popup-icon">🚌</span>
                  <strong>{bus.name}</strong>
                  <span className={`popup-status ${bus.status.toLowerCase().replace(' ', '-')}`}>
                    {bus.status}
                  </span>
                </div>
                <div className="popup-details">
                  <p><strong>Bus Number:</strong> {bus.busNumber}</p>
                  <p><strong>Passengers:</strong> {bus.passengers} people</p>
                  <p><strong>Next Stop:</strong> {bus.nextStop}</p>
                  <p><strong>Arrival:</strong> {bus.arrivalTime}</p>
                </div>
                <button 
                  className="popup-track-btn" 
                  onClick={() => trackBus(bus)}
                >
                  Track This Bus →
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default BusMap;