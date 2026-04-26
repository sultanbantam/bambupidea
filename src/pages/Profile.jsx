import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

function Profile() {
  const { currentUser, logout, plantings, harvests } = useContext(AppContext);

  // Stats for profile
  const myPlantings = plantings.filter(p => p.userId === currentUser.pi_uid);
  const myHarvests = harvests.filter(h => h.userId === currentUser.pi_uid);

  const totalPlantedRecords = myPlantings.length;
  const totalHarvestValue = myHarvests.reduce((acc, curr) => acc + curr.estimated_value, 0);
  const piBalance = currentUser.pi_balance !== undefined ? currentUser.pi_balance : 50;

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>My Profile</h2>

      <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
        <div style={{ 
          width: '80px', height: '80px', 
          backgroundColor: 'var(--color-primary-light)', 
          borderRadius: '50%', 
          margin: '0 auto 1rem auto',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontSize: '2rem', fontWeight: 'bold'
        }}>
          {currentUser.username.charAt(0).toUpperCase()}
        </div>
        <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.5rem' }}>{currentUser.username}</h3>
        <p style={{ color: 'var(--color-text-muted)', margin: '0 0 1rem 0' }}>Pi UID: {currentUser.pi_uid}</p>
        
        <div style={{ display: 'inline-block', backgroundColor: 'var(--color-bg)', color: 'var(--color-primary)', padding: '0.5rem 1rem', borderRadius: '2rem', fontWeight: 'bold' }}>
          Rank : {currentUser.level}
        </div>
      </div>

      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none' }}>
        <div>
          <span style={{ fontSize: '0.875rem', opacity: 0.9 }}>Digital Wallet</span>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 'bold', fontSize: '1.75rem' }}>π</span> {piBalance.toFixed(2)} PI
          </h2>
        </div>
        <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '1rem', fontSize: '0.875rem', fontWeight: 'bold' }}>
          Active
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
            {currentUser.total_bamboo}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Lifetime Seeds</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ea580c' }}>
            IDR {(totalHarvestValue / 1000).toFixed(0)}k
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Estimated Value</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1rem 0' }}>Activity Overview</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)' }}>
          <span style={{ color: 'var(--color-text-muted)' }}>Planting Sessions</span>
          <span style={{ fontWeight: 'bold' }}>{totalPlantedRecords}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
          <span style={{ color: 'var(--color-text-muted)' }}>Successful Harvests</span>
          <span style={{ fontWeight: 'bold' }}>{myHarvests.length}</span>
        </div>
      </div>

      <button className="btn btn-secondary" style={{ marginTop: '2rem' }} onClick={logout}>
        Log Out
      </button>
      <div style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
        BambuPIdea MVP v1.0.0
      </div>
    </div>
  );
}

export default Profile;
