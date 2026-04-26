import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

function BuildPage() {
  const { showAlert } = useContext(AppContext);

  const houses = [
    {
      id: 1,
      name: "Classic Bamboo Type 21",
      image: "https://images.unsplash.com/photo-1512401824424-814abfa4fa80?w=500&q=80",
      description: "A compact 21m² bamboo cabin perfect for eco-tourism resorts or small families. Features natural ventilation and treated bamboo for 20+ years of durability.",
      requirements: "Requires approx. 120 Bamboo Poles."
    },
    {
      id: 2,
      name: "Modern Bamboo Type 36",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80",
      description: "A spacious 36m² eco-home with modern finishes. Integrates bamboo structure with earth materials for high thermal comfort and stunning aesthetics.",
      requirements: "Requires approx. 250 Bamboo Poles."
    }
  ];

  const handleBuild = (house) => {
    showAlert(`Request to build ${house.name} submitted successfully! (MVP Mock)`);
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0 }}>Build Eco House</h2>
        <p>Transform your harvest into sustainable architecture.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {houses.map(house => (
          <div key={house.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <img 
              src={house.image} 
              alt={house.name} 
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ margin: '0 0 0.5rem 0' }}>{house.name}</h3>
              <p style={{ color: 'var(--color-primary)', fontWeight: '500', fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>
                {house.requirements}
              </p>
              <p style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>{house.description}</p>
              <button className="btn" onClick={() => handleBuild(house)}>
                Build Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BuildPage;
