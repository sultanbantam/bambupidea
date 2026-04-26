import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

function Harvest() {
  const { plantings, setPlantings, setHarvests, currentUser, generateId, showAlert } = useContext(AppContext);
  const navigate = useNavigate();

  // Only growing/planted items can be harvested
  const myPlantings = plantings.filter(p => p.userId === currentUser.pi_uid && p.status !== 'harvested');

  const [selectedPlanting, setSelectedPlanting] = useState('');
  const [totalOutput, setTotalOutput] = useState('');
  const [bambooCategory, setBambooCategory] = useState('betung');
  const [productCondition, setProductCondition] = useState('raw');
  const [diameter, setDiameter] = useState('');
  const [marketRegion, setMarketRegion] = useState('indonesia');

  const calculatePricing = () => {
    if (!totalOutput || Number(totalOutput) <= 0) {
      return { total: 0, basePrice: 0, multiplier: 1.0, output: 0, unit: 'm' };
    }
    
    let basePrice = 0;
    let unit = 'm';
    const d = Number(diameter) || 0;

    if (bambooCategory === 'betung') {
        if (productCondition === 'raw') {
            basePrice = d < 10 ? 4000 : 6000;
        } else {
            basePrice = d < 10 ? 10000 : 20000;
        }
    } else {
        if (productCondition === 'raw') {
            basePrice = d < 7 ? 2500 : 4000;
        } else {
            basePrice = d < 7 ? 7000 : 15000;
        }
    }

    let multiplier = 1.0;
    switch(marketRegion) {
      case 'indonesia': multiplier = 1.0; break;
      case 'asia': multiplier = 1.2; break;
      case 'india': multiplier = 1.1; break;
      case 'africa': multiplier = 1.1; break;
      case 'middle_east': multiplier = 1.5; break;
      case 'europe': multiplier = 2.0; break;
      case 'america': multiplier = 2.2; break;
      case 'australia': multiplier = 2.0; break;
      case 'global': multiplier = 1.8; break;
      default: multiplier = 1.0;
    }

    const total = Math.round(basePrice * multiplier * Number(totalOutput));
    return { total, basePrice, multiplier, output: Number(totalOutput), unit };
  };

  const pricingData = calculatePricing();

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!selectedPlanting) {
      showAlert('Please select a planting to harvest!');
      return;
    }
    if(!totalOutput || Number(totalOutput) <= 0) return;

    const estimatedValue = pricingData.total;

    const newHarvest = {
      id: generateId(),
      userId: currentUser.pi_uid,
      plantingId: selectedPlanting,
      total_output: Number(totalOutput),
      estimated_value: estimatedValue,
      product_type: `${bambooCategory} (${productCondition}, ${diameter}cm)`,
      market_region: marketRegion,
      unit_type: pricingData.unit,
      date: new Date().toISOString()
    };

    setHarvests(prev => [newHarvest, ...prev]);

    setPlantings(prev => prev.map(p => {
      if(p.id === selectedPlanting) {
        return { ...p, status: 'harvested' };
      }
      return p;
    }));

    showAlert(`Harvest successful! Estimated Value: IDR ${estimatedValue.toLocaleString()}`);
    navigate('/lifecycle');
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button onClick={() => navigate('/lifecycle')} className="btn-secondary" style={{ padding: '0.5rem', border: 'none' }}>← Back</button>
        <h2 style={{ margin: 0 }}>Harvest Bamboo</h2>
      </div>

      <div className="card">
        {myPlantings.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--color-primary)' }}>No bamboo available for harvest.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Select Planting</label>
              <select className="select" value={selectedPlanting} onChange={e => setSelectedPlanting(e.target.value)} required>
                <option value="">-- Select --</option>
                {myPlantings.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.amount}x {p.bamboo_type} ({p.status})
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Bamboo Category</label>
              <select className="select" value={bambooCategory} onChange={e => setBambooCategory(e.target.value)}>
                <option value="betung">Bambu Betung (Giant Bamboo)</option>
                <option value="non_betung">Bambu Non-Betung / Lainnya</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Condition</label>
                <select className="select" value={productCondition} onChange={e => setProductCondition(e.target.value)}>
                  <option value="raw">Raw Material</option>
                  <option value="awet">Bambu Awet (Treated)</option>
                </select>
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Diameter (cm)</label>
                <input 
                  type="number" 
                  className="input" 
                  value={diameter} 
                  onChange={e => setDiameter(e.target.value)} 
                  placeholder={bambooCategory === 'betung' ? "e.g. 10" : "e.g. 7"} 
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Total Length (meters)</label>
              <input 
                type="number" 
                className="input" 
                value={totalOutput} 
                onChange={e => setTotalOutput(e.target.value)} 
                placeholder="e.g. 100" 
                required
              />
            </div>

            <div className="input-group">
              <label>Market Region</label>
              <select className="select" value={marketRegion} onChange={e => setMarketRegion(e.target.value)}>
                <option value="indonesia">Indonesia</option>
                <option value="asia">Asia</option>
                <option value="india">India</option>
                <option value="africa">Africa</option>
                <option value="middle_east">Middle East</option>
                <option value="europe">Europe</option>
                <option value="america">America</option>
                <option value="australia">Australia</option>
                <option value="global">Global</option>
              </select>
            </div>

            <div style={{ backgroundColor: 'var(--color-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid var(--color-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 'bold' }}>AI Estimated Value</p>
                 <h3 style={{ margin: 0, color: 'var(--color-primary)' }}>IDR {pricingData.total.toLocaleString()}</h3>
              </div>
              
              <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--color-border)', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span>Base Price:</span> <strong>IDR {pricingData.basePrice.toLocaleString()}/{pricingData.unit}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span>Region Multiplier:</span> <strong>x{pricingData.multiplier.toFixed(1)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Total Output:</span> <strong>{pricingData.output} {pricingData.unit}</strong>
                </div>
              </div>
            </div>

            <button type="submit" className="btn">Harvest Now</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Harvest;
