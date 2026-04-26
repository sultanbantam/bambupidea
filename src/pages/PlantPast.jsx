import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import BambooSelect from '../components/BambooSelect';
import MapLocationSelect from '../components/MapLocationSelect';

function PlantPast() {
  const { currentUser, setPlantings, generateId, showAlert, updateUserStats } = useContext(AppContext);
  const navigate = useNavigate();

  const [amount, setAmount] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [pastDate, setPastDate] = useState('');
  const [status, setStatus] = useState('growing');

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!amount || Number(amount) <= 0) return;
    if(!pastDate) {
      showAlert('Please specify the past planting date.');
      return;
    }
    if(!type) {
      showAlert('Please select a bamboo type!');
      return;
    }
    if(!location) {
      showAlert('Please select a planting location!');
      return;
    }

    // Convert string date (YYYY-MM-DD) to ISOString
    const dateObj = new Date(pastDate);

    const newPlanting = {
      id: generateId(),
      userId: currentUser.pi_uid,
      amount: Number(amount),
      bamboo_type: type,
      location,
      date: dateObj.toISOString(),
      status: status
    };

    setPlantings(prev => [newPlanting, ...prev]);
    updateUserStats(Number(amount));
    showAlert('Past planted bamboo successfully added!');
    navigate('/');
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button onClick={() => navigate('/')} className="btn-secondary" style={{ padding: '0.5rem', border: 'none' }}>← Back</button>
        <h2 style={{ margin: 0 }}>Add Past Planting</h2>
      </div>

      <div className="card">
        <p style={{ color: 'var(--color-primary)', fontSize: '0.875rem' }}>
          Record bamboo that you have planted in the past (weeks, months, or years ago).
        </p>
        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
          <div className="input-group">
            <label>Amount (Seeds)</label>
            <input 
              type="number" 
              className="input" 
              value={amount} 
              onChange={e => setAmount(e.target.value)} 
              placeholder="e.g. 150" 
              required
            />
          </div>

          <div className="input-group">
            <label>Planting Date</label>
            <input 
              type="date" 
              className="input" 
              value={pastDate} 
              onChange={e => setPastDate(e.target.value)} 
              max={new Date().toISOString().split("T")[0]}
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

          <div className="input-group">
            <label>Current Status</label>
            <select className="select" value={status} onChange={e => setStatus(e.target.value)}>
              <option value="planted">Just Planted (Needs Maintenance)</option>
              <option value="growing">Growing (Ready for Harvest)</option>
            </select>
          </div>

          <button type="submit" className="btn" style={{ marginTop: '1rem' }}>Add Record</button>
        </form>
      </div>
    </div>
  );
}

export default PlantPast;
