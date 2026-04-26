import React, { useState, useRef, useEffect } from 'react';
import { bambooSpecies } from '../utils/bambooData';

function BambooSelect({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState(value && !value.includes('(') ? value : '');
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (common, scientific, region) => {
    const formattedStr = `${common} (${scientific}) - ${region}`;
    onChange(formattedStr);
    setIsCustom(false);
    setIsOpen(false);
    setSearch('');
  };

  const handleCustomSelect = () => {
    setIsCustom(true);
    onChange(customValue);
    setIsOpen(false);
  };

  const handleCustomChange = (e) => {
    const val = e.target.value;
    setCustomValue(val);
    onChange(val);
  };

  // Filter logic
  const keyword = search.toLowerCase();
  const filteredData = {};

  Object.entries(bambooSpecies).forEach(([group, items]) => {
    const filteredItems = items.filter(item => 
      item.common.toLowerCase().includes(keyword) || 
      item.scientific.toLowerCase().includes(keyword) ||
      item.region.toLowerCase().includes(keyword)
    );
    if (filteredItems.length > 0) {
      filteredData[group] = filteredItems;
    }
  });

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
      {/* Display Field */}
      {!isCustom ? (
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="input"
          style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {value || "-- Select Bamboo Type --"}
          </span>
          <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>▼</span>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input 
            type="text" 
            className="input" 
            style={{ flex: 1 }}
            value={customValue}
            onChange={handleCustomChange}
            placeholder="Enter custom bamboo species..."
            required
          />
          <button 
            type="button" 
            onClick={() => { setIsCustom(false); onChange(''); }}
            className="btn-secondary"
            style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Dropdown Menu */}
      {isOpen && !isCustom && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, 
          marginTop: '0.25rem', padding: '0.5rem', 
          backgroundColor: 'var(--color-card)', 
          border: '1px solid var(--color-border)', 
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 1000,
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          <input 
            type="text" 
            className="input"
            style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
            placeholder="Search by name, scientific name, or region..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />

          {Object.entries(filteredData).map(([group, items]) => (
            <div key={group} style={{ marginBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-primary)', padding: '0.25rem 0.5rem', backgroundColor: 'var(--color-bg)' }}>
                {group}
              </div>
              {items.map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => handleSelect(item.common, item.scientific, item.region)}
                  style={{ 
                    padding: '0.5rem', 
                    cursor: 'pointer', 
                    fontSize: '0.875rem',
                    borderBottom: '1px solid var(--color-border)',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{ fontWeight: '600' }}>{item.common}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    <em>{item.scientific}</em> • {item.region}
                  </div>
                </div>
              ))}
            </div>
          ))}

          <div 
            onClick={handleCustomSelect}
            style={{ 
              padding: '0.5rem', 
              cursor: 'pointer', 
              fontSize: '0.875rem',
              fontWeight: 'bold',
              color: 'var(--color-primary)',
              textAlign: 'center',
              borderTop: '1px solid var(--color-border)'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            + Other Bamboo Species (Custom Input)
          </div>
        </div>
      )}
    </div>
  );
}

export default BambooSelect;
