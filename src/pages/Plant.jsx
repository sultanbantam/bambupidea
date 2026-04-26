import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import BambooSelect from '../components/BambooSelect';
import MapLocationSelect from '../components/MapLocationSelect';

function Plant() {
  const { currentUser, setPlantings, generateId, showAlert, updateUserStats } = useContext(AppContext);
  const navigate = useNavigate();

  const [amount, setAmount] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!amount || Number(amount) <= 0) return;
    if(!type) {
      showAlert('Please select a bamboo type!');
      return;
    }
    if(!location) {
      showAlert('Please select a planting location!');
      return;
    }

    const newPlanting = {
      id: generateId(),
      userId: currentUser.pi_uid,
      amount: Number(amount),
      bamboo_type: type,
      location,
      date: new Date().toISOString(),
      status: 'planted'
    };

    setPlantings(prev => [newPlanting, ...prev]);
    updateUserStats(Number(amount));
    showAlert('Successfully planted bamboo!');
    navigate('/');
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button onClick={() => navigate('/lifecycle')} className="btn-secondary" style={{ padding: '0.5rem', border: 'none' }}>← Back</button>
        <h2 style={{ margin: 0 }}>Plant Bamboo</h2>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Amount (Seeds)</label>
            <input 
              type="number" 
              className="input" 
              value={amount} 
              onChange={e => setAmount(e.target.value)} 
              placeholder="e.g. 50" 
              required
            />
          </div>

          <div className="input-group">
            <label>Bamboo Type</label>
            <BambooSelect value={type} onChange={setType} />
          </div>

          <div className="input-group">
            <label>Location</label>
            <MapLocationSelect value={location} onChange={setLocation} />
          </div>

          <button type="submit" className="btn" style={{ marginTop: '1rem' }}>Plant Now</button>
        </form>
      </div>
    </div>
  );
}

export default Plant;
