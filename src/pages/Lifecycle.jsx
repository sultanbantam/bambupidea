import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, Droplet, Scissors, Hammer, Sprout as CultivateIcon } from 'lucide-react';

function Lifecycle() {
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Plant', path: 'plant', icon: <Sprout size={32} color="var(--color-primary)" />, desc: 'Plant new bamboo seeds' },
    { label: 'Maintain', path: 'maintain', icon: <Droplet size={32} color="#0284c7" />, desc: 'Water and fertilize plants' },
    { label: 'Harvest', path: 'harvest', icon: <Scissors size={32} color="#ea580c" />, desc: 'Harvest mature bamboo' },
    { label: 'Utilize', path: 'utilize', icon: <Hammer size={32} color="#4f46e5" />, desc: 'Process bamboo for use' },
    { label: 'Cultivate', path: 'cultivate', icon: <CultivateIcon size={32} color="#16a34a" />, desc: 'Grow new bamboo seedlings' }
  ];

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>Bamboo Lifecycle</h2>
      <p>Select a phase to continue your bamboo journey.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
        {menuItems.map(item => (
          <div 
            key={item.label} 
            className="card" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1.5rem', 
              cursor: 'pointer',
              transition: 'transform 0.1s' 
            }}
            onClick={() => navigate(`/lifecycle/${item.path}`)}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ 
              backgroundColor: 'var(--color-bg)', 
              padding: '1rem', 
              borderRadius: 'var(--radius-md)' 
            }}>
              {item.icon}
            </div>
            <div>
              <h3 style={{ margin: 0 }}>{item.label}</h3>
              <p style={{ margin: 0, marginTop: '0.25rem' }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Lifecycle;
