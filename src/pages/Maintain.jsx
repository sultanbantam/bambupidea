import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

function Maintain() {
  const { plantings, setPlantings, setMaintenances, generateId, showAlert, currentUser } = useContext(AppContext);
  const navigate = useNavigate();

  // Only show plantings belonging to currentUser that has not been harvested
  const myPlantings = plantings.filter(p => p.userId === currentUser.pi_uid && p.status !== 'harvested');

  const [selectedPlanting, setSelectedPlanting] = useState('');
  const [activity, setActivity] = useState('watering');
  const [note, setNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!selectedPlanting) {
      showAlert('Please select a planting record!');
      return;
    }

    const newMaintenance = {
      id: generateId(),
      userId: currentUser.pi_uid,
      plantingId: selectedPlanting,
      activity,
      note,
      date: new Date().toISOString()
    };

    setMaintenances(prev => [newMaintenance, ...prev]);

    // Update planting status to 'growing' if it was 'planted'
    setPlantings(prev => prev.map(p => {
      if(p.id === selectedPlanting && p.status === 'planted') {
        return { ...p, status: 'growing' };
      }
      return p;
    }));

    showAlert('Maintenance recorded successfully!');
    navigate('/lifecycle');
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button onClick={() => navigate('/lifecycle')} className="btn-secondary" style={{ padding: '0.5rem', border: 'none' }}>← Back</button>
        <h2 style={{ margin: 0 }}>Maintain Bamboo</h2>
      </div>

      <div className="card">
        {myPlantings.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--color-primary)' }}>You don't have any active bamboo to maintain. Plant some first!</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Select Planting</label>
              <select className="select" value={selectedPlanting} onChange={e => setSelectedPlanting(e.target.value)} required>
                <option value="">-- Select --</option>
                {myPlantings.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.amount}x {p.bamboo_type} ({new Date(p.date).toLocaleDateString()}) - Status: {p.status}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Activity</label>
              <select className="select" value={activity} onChange={e => setActivity(e.target.value)}>
                <option value="watering">Watering</option>
                <option value="fertilizing">Fertilizing</option>
                <option value="weeding">Weeding</option>
                <option value="database">Pembuatan Database</option>
                <option value="other">Lainnya</option>
              </select>
            </div>

            <div className="input-group">
              <label>Notes</label>
              <textarea 
                className="textarea" 
                rows="3" 
                value={note} 
                onChange={e => setNote(e.target.value)} 
                placeholder="Optional notes about the condition..."
              ></textarea>
            </div>

            <button type="submit" className="btn" style={{ marginTop: '1rem' }}>Save Maintenance</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Maintain;
