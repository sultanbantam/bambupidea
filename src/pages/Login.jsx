import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';

function Login() {
  const { loginWithPi } = useContext(AppContext);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || isLoading) return;
    
    setIsLoading(true);
    console.log("Processing login for:", username);
    
    try {
      await loginWithPi(username);
    } catch (err) {
      console.error("Login component error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100vh', paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '3rem' }}>
        <img src="logo.png" alt="BambuPIdea Logo" style={{ width: '160px', height: '160px', objectFit: 'contain', marginBottom: '-1rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }} />
        <h1 style={{ color: 'var(--color-primary)', fontSize: '2.5rem', margin: 0, position: 'relative', zIndex: 2 }}>BambuPIdea</h1>
        <p>AI Bamboo Lifecycle Super App</p>
      </div>

      <div className="card">
        <h2>Pi Network Login</h2>
        <p>Connect your Pi Network account to start planting.</p>
        <form onSubmit={handleLogin} style={{ marginTop: '1.5rem' }}>
          <div className="input-group">
            <label>Username</label>
            <input 
              type="text" 
              className="input" 
              placeholder="Enter your username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn" style={{ marginTop: '1rem', opacity: isLoading ? 0.7 : 1 }} disabled={isLoading}>
            {isLoading ? (
              <span>Logging in...</span>
            ) : (
              <>
                <span style={{ 
                  display: 'inline-block', 
                  width: '20px', 
                  height: '20px', 
                  background: 'white',
                  color: 'var(--color-primary)',
                  borderRadius: '50%',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  lineHeight: '20px',
                  textAlign: 'center'
                }}>π</span>
                Login with Pi
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
