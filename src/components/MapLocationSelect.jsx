import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { globalLocations, getAllLocationPins } from '../utils/locationData';

// Fix for default Leaflet marker icons in React
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const customPinIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to handle map clicks for custom locations
function MapClickHandler({ onLocationSelect, mapRef }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapLocationSelect({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'map'
  const [customPosition, setCustomPosition] = useState(null);
  
  const dropdownRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (loc) => {
    // Expected storage format: Location Name, Region (Lat, Lng) - Category
    const locationString = `${loc.name} (${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}) - [${loc.category}]`;
    onChange(locationString);
    setIsOpen(false);
    setSearch('');
  };

  const handleMapClick = (lat, lng) => {
    setCustomPosition({ lat, lng });
    const locationString = `Custom Map Location (${lat.toFixed(4)}, ${lng.toFixed(4)}) - [Custom]`;
    onChange(locationString);
    // Don't close immediately so user can see their pin placed
  };

  const handleUseGPS = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCustomPosition({ lat, lng });
        const locationString = `Auto GPS Location (${lat.toFixed(4)}, ${lng.toFixed(4)}) - [Device Sensor]`;
        onChange(locationString);
        
        // Fly to location if map is open
        if(mapRef.current) {
          mapRef.current.flyTo([lat, lng], 13);
        }
      }, function(error) {
        alert("GPS Error: " + error.message);
      });
    } else {
      alert("Geolocation is not available.");
    }
  };

  // Filter List Logic
  const keyword = search.toLowerCase();
  const filteredData = {};

  Object.entries(globalLocations).forEach(([region, items]) => {
    const matched = items.filter(loc => 
      loc.name.toLowerCase().includes(keyword) || 
      loc.category.toLowerCase().includes(keyword) ||
      region.toLowerCase().includes(keyword)
    );
    if (matched.length > 0) filteredData[region] = matched;
  });

  const allPins = getAllLocationPins();

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
      {/* Display Selector */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="input"
        style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--color-card)' }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {value || "-- Select Planting Location --"}
        </span>
        <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>▼</span>
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, 
          marginTop: '0.25rem', padding: '0.5rem', 
          backgroundColor: 'var(--color-card)', 
          border: '1px solid var(--color-border)', 
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 9999, // very high so map appears over other elements
          maxHeight: '400px',
          display: 'flex', flexDirection: 'column'
        }}>
          
          {/* Tabs */}
          <div style={{ display: 'flex', marginBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>
            <button 
              type="button"
              style={{ flex: 1, padding: '0.5rem', border: 'none', backgroundColor: activeTab === 'list' ? 'var(--color-bg)' : 'transparent', fontWeight: activeTab === 'list' ? 'bold' : 'normal', color: 'var(--color-text)', borderBottom: activeTab === 'list' ? '2px solid var(--color-primary)' : 'none', cursor: 'pointer' }}
              onClick={() => setActiveTab('list')}
            >
              Dropdown Search
            </button>
            <button 
              type="button"
              style={{ flex: 1, padding: '0.5rem', border: 'none', backgroundColor: activeTab === 'map' ? 'var(--color-bg)' : 'transparent', fontWeight: activeTab === 'map' ? 'bold' : 'normal', color: 'var(--color-text)', borderBottom: activeTab === 'map' ? '2px solid var(--color-primary)' : 'none', cursor: 'pointer' }}
              onClick={() => setActiveTab('map')}
            >
              Interactive Map
            </button>
          </div>

          <button 
            type="button" 
            onClick={handleUseGPS}
            className="btn btn-secondary" 
            style={{ marginBottom: '0.5rem', padding: '0.5rem', fontSize: '0.875rem' }}
          >
            📍 Detect GPS Auto-Location
          </button>

          {activeTab === 'list' && (
            <div style={{ overflowY: 'auto', flex: 1 }}>
              <input 
                type="text" 
                className="input"
                style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
                placeholder="Search location, region, or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />

              {Object.entries(filteredData).map(([region, items]) => (
                <div key={region} style={{ marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-primary)', padding: '0.25rem 0.5rem', backgroundColor: 'var(--color-bg)' }}>
                    {region}
                  </div>
                  {items.map((item, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => handleSelect(item)}
                      style={{ 
                        padding: '0.5rem', 
                        cursor: 'pointer', 
                        fontSize: '0.875rem',
                        borderBottom: '1px solid var(--color-border)',
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg)'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div style={{ fontWeight: '600' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        Category: {item.category} • Lat: {item.lat}, Lng: {item.lng}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'map' && (
            <div style={{ height: '250px', width: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
              <MapContainer 
                center={customPosition ? [customPosition.lat, customPosition.lng] : [-0.7893, 113.9213]} 
                zoom={4} 
                style={{ height: '100%', width: '100%' }}
                ref={mapRef}
                whenReady={(mapInstance) => { setTimeout(() => mapInstance.target.invalidateSize(), 100); }}
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* Pre-defined location Pins */}
                {allPins.map((pin, i) => (
                  <Marker key={i} position={[pin.lat, pin.lng]} icon={defaultIcon}>
                    <Popup>
                      <strong>{pin.name}</strong><br/>
                      {pin.region} - {pin.category}<br/>
                      <button type="button" onClick={() => handleSelect(pin)} style={{ marginTop: '5px', padding: '4px 8px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Set Location
                      </button>
                    </Popup>
                  </Marker>
                ))}

                {/* Custom User Click Pin */}
                {customPosition && (
                  <Marker position={[customPosition.lat, customPosition.lng]} icon={customPinIcon}>
                    <Popup>Your Custom Location</Popup>
                  </Marker>
                )}

                <MapClickHandler onLocationSelect={handleMapClick} mapRef={mapRef} />
              </MapContainer>
            </div>
          )}
          
        </div>
      )}
    </div>
  );
}

export default MapLocationSelect;
