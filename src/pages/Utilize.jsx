import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

function Utilize() {
  const { harvests, setUtilizations, currentUser, generateId, showAlert } = useContext(AppContext);
  const navigate = useNavigate();

  const myHarvests = harvests.filter(h => h.userId === currentUser.pi_uid);

  const [selectedHarvest, setSelectedHarvest] = useState('');
  const [type, setType] = useState('construction');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!selectedHarvest) {
      showAlert('Please select a harvest record!');
      return;
    }

    const newUtilization = {
      id: generateId(),
      userId: currentUser.pi_uid,
      harvestId: selectedHarvest,
      type,
      description,
      date: new Date().toISOString()
    };

    setUtilizations(prev => [newUtilization, ...prev]);
    showAlert('Utilization recorded successfully!');
    navigate('/lifecycle');
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button onClick={() => navigate('/lifecycle')} className="btn-secondary" style={{ padding: '0.5rem', border: 'none' }}>← Back</button>
        <h2 style={{ margin: 0 }}>Utilize Bamboo</h2>
      </div>

      <div className="card">
        {myHarvests.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--color-primary)' }}>You need to harvest bamboo first before utilizing it.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Select Harvest Source</label>
              <select className="select" value={selectedHarvest} onChange={e => setSelectedHarvest(e.target.value)} required>
                <option value="">-- Select --</option>
                {myHarvests.map(h => (
                  <option key={h.id} value={h.id}>
                    Output: {h.total_output} (Value: IDR {h.estimated_value.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Utilization Type</label>
              <select className="select" value={type} onChange={e => setType(e.target.value)}>
                <option value="construction">Construction Material</option>
                <option value="furniture">Furniture</option>
                <option value="craft">Craft & Arts</option>
                <option value="energy">Energy (Bio-mass)</option>
              </select>
            </div>

            <div className="input-group">
              <label>Description</label>
              <textarea 
                className="textarea" 
                rows="3" 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                placeholder="e.g. Used for scaffolding..."
                required
              ></textarea>
            </div>

            <button type="submit" className="btn" style={{ marginTop: '1rem' }}>Save Utilization</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Utilize;
