import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

function Cultivate() {
  const { setCultivations, currentUser, generateId, showAlert } = useContext(AppContext);
  const navigate = useNavigate();

  const [seedCount, setSeedCount] = useState('');
  const [location, setLocation] = useState('');
  const [method, setMethod] = useState('seeds');

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!seedCount || Number(seedCount) <= 0) return;

    const newCultivation = {
      id: generateId(),
      userId: currentUser.pi_uid,
      seed_count: Number(seedCount),
      location,
      method,
      date: new Date().toISOString()
    };

    setCultivations(prev => [newCultivation, ...prev]);
    showAlert('Cultivation started!');
    navigate('/lifecycle');
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button onClick={() => navigate('/lifecycle')} className="btn-secondary" style={{ padding: '0.5rem', border: 'none' }}>← Back</button>
        <h2 style={{ margin: 0 }}>Cultivate Bamboo</h2>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Seedling Count</label>
            <input 
              type="number" 
              className="input" 
              value={seedCount} 
              onChange={e => setSeedCount(e.target.value)} 
              placeholder="e.g. 200" 
              required
            />
          </div>

          <div className="input-group">
            <label>Nursery Location</label>
            <input 
              type="text" 
              className="input" 
              value={location} 
              onChange={e => setLocation(e.target.value)} 
              placeholder="e.g. Green House A" 
              required
            />
          </div>

          <div className="input-group">
            <label>Cultivation Method</label>
            <select className="select" value={method} onChange={e => setMethod(e.target.value)}>
              <option value="seeds">Seeds</option>
              <option value="rhizome">Rhizome Cuttings</option>
              <option value="culm">Culm Cuttings</option>
              <option value="branch">Branch Cuttings</option>
            </select>
          </div>

          <button type="submit" className="btn" style={{ marginTop: '1rem' }}>Start Cultivation</button>
        </form>
      </div>
    </div>
  );
}

export default Cultivate;
