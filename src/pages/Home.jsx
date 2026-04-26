import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

function Home() {
  const { currentUser, plantings } = useContext(AppContext);
  const navigate = useNavigate();

  // Calculate stats
  const plantedCount = plantings.filter(p => p.status === 'planted').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const growingCount = plantings.filter(p => p.status === 'growing').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const harvestedCount = plantings.filter(p => p.status === 'harvested').reduce((acc, curr) => acc + Number(curr.amount), 0);

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Hello, {currentUser.username}! 👋</h2>
        <p style={{ margin: 0, color: 'var(--color-primary)' }}>Level: {currentUser.level}</p>
      </div>

      <div className="card" style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)', color: 'white', border: 'none' }}>
        <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Total Bamboo Planted</h3>
        <p style={{ color: 'rgba(255,255,255,0.8)', margin:0 }}>Lifetime achievement</p>
        <h1 style={{ color: 'white', fontSize: '3rem', margin: '0.5rem 0' }}>{currentUser.total_bamboo}</h1>
        <p style={{ color: 'white', margin:0, fontWeight:'600' }}>Seeds</p>
      </div>

      <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Lifecycle Summary</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ marginBottom: 0 }}>
          <div style={{ color: 'var(--color-primary)', fontWeight: 'bold', fontSize: '1.25rem' }}>{plantedCount}</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Planted</div>
        </div>
        <div className="card" style={{ marginBottom: 0 }}>
          <div style={{ color: '#eab308', fontWeight: 'bold', fontSize: '1.25rem' }}>{growingCount}</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Growing</div>
        </div>
        <div className="card" style={{ marginBottom: 0 }}>
          <div style={{ color: '#f97316', fontWeight: 'bold', fontSize: '1.25rem' }}>{harvestedCount}</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Harvested</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button className="btn" onClick={() => navigate('/lifecycle/plant')}>
          Start Planting (New)
        </button>
        <button className="btn btn-secondary" onClick={() => navigate('/lifecycle/plant-past')}>
          Add Past Planting (Record)
        </button>
      </div>
    </div>
  );
}

export default Home;
