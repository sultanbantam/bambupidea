import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Initial state logic with localStorage
  const loadData = (key, defaultValue) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  };

  const [currentUser, setCurrentUser] = useState(() => loadData('pi_user', null));
  const [plantings, setPlantings] = useState(() => loadData('bambu_plantings', []));
  const [maintenances, setMaintenances] = useState(() => loadData('bambu_maintenances', []));
  const [harvests, setHarvests] = useState(() => loadData('bambu_harvests', []));
  const [utilizations, setUtilizations] = useState(() => loadData('bambu_utilizations', []));
  const [cultivations, setCultivations] = useState(() => loadData('bambu_cultivations', []));
  
  const [alertMessage, setAlertMessage] = useState(null);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('pi_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Pi SDK Initialization
  useEffect(() => {
    if (window.Pi) {
      window.Pi.init({ version: "2.0", sandbox: true });
    }
  }, []);

  const onIncompletePaymentFound = (payment) => {
    console.log("Incomplete Pi Payment recovered: ", payment);
  };

  useEffect(() => {
    localStorage.setItem('bambu_plantings', JSON.stringify(plantings));
  }, [plantings]);

  useEffect(() => {
    localStorage.setItem('bambu_maintenances', JSON.stringify(maintenances));
  }, [maintenances]);

  useEffect(() => {
    localStorage.setItem('bambu_harvests', JSON.stringify(harvests));
  }, [harvests]);

  useEffect(() => {
    localStorage.setItem('bambu_utilizations', JSON.stringify(utilizations));
  }, [utilizations]);

  useEffect(() => {
    localStorage.setItem('bambu_cultivations', JSON.stringify(cultivations));
  }, [cultivations]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const showAlert = (message) => {
    setAlertMessage(message);
    setTimeout(() => setAlertMessage(null), 3000);
  };

  // Actions
  const loginWithPi = async (fallbackUsername) => {
    console.log("Starting login flow for:", fallbackUsername);
    
    // Detection logic: if on localhost/127.0.0.1 and not in a mobile-like environment, 
    // it's highly likely a desktop browser where Pi.authenticate will hang.
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.includes('192.168');
    
    try {
      if (!window.Pi) {
        throw new Error("Pi SDK not detected.");
      }

      // If we are on localhost, we might want to skip authenticate or wrap it in a strict timeout
      // to avoid the infinite "hanging" state in standard browsers.
      console.log("Pi SDK detected. Attempting authentication...");
      
      const scopes = ['username', 'payments'];
      
      // Wrap Pi.authenticate in a promise with a timeout
      const authPromise = window.Pi.authenticate(scopes, onIncompletePaymentFound);
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("AUTH_TIMEOUT")), 3000)
      );

      // if it's localhost, we can be even more aggressive or just skip to fallback
      // But let's try the timeout first to allow it if they are actually using a Pi-tunnel
      const authResult = await Promise.race([authPromise, timeoutPromise]);
      
      const user = {
        username: authResult.user.username,
        pi_uid: authResult.user.uid,
        total_bamboo: 0,
        level: "Seed",
        pi_balance: 50,
        ai_quota: 3
      };
      
      setCurrentUser(user);
      showAlert(`Authenticated securely as @${authResult.user.username}!`);
      
    } catch (err) {
      console.warn("Pi Authentication diverted or failed. Mode: Fallback.", err.message);
      
      // Fallback architecture to ensure localhost development isn't blocked by Pi Browser restrictions
      const user = {
        username: (fallbackUsername || "pi_developer").replace(/^@/, ''), // handle @ prefix if user typed it
        pi_uid: generateId(),
        total_bamboo: 0,
        level: "Seed",
        pi_balance: 50,
        ai_quota: 3
      };
      setCurrentUser(user);
      showAlert(err.message === "AUTH_TIMEOUT" ? "Environment: Mock Auth (SDK Timeout)" : "Mock Environment: Authenticated!");
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Update user leveling based on total_bamboo
  const updateUserStats = (amount) => {
    setCurrentUser(prev => {
      const newTotal = prev.total_bamboo + amount;
      let newLevel = "Seed";
      if (newTotal >= 500) newLevel = "Forest Guardian";
      else if (newTotal >= 100) newLevel = "Grower";

      return {
        ...prev,
        total_bamboo: newTotal,
        level: newLevel
      };
    });
  };

  const deductQuota = () => {
    setCurrentUser(prev => ({
      ...prev,
      ai_quota: (prev.ai_quota !== undefined ? prev.ai_quota : 3) - 1,
      pi_balance: prev.pi_balance !== undefined ? prev.pi_balance : 50
    }));
  };

  const buyAiQuota = (destinationAddress) => {
    setCurrentUser(prev => {
      const prevBal = prev.pi_balance !== undefined ? prev.pi_balance : 50;
      if (prevBal >= 1) {
        const hashDisplay = destinationAddress ? `${destinationAddress.substring(0, 10)}...` : 'Contract';
        showAlert(`Success: 1.0 PI Sent to ${hashDisplay}. Unlocked +10 AI Queries!`);
        return {
          ...prev,
          pi_balance: prevBal - 1,
          ai_quota: (prev.ai_quota !== undefined ? prev.ai_quota : 3) + 10
        };
      } else {
        showAlert("Insufficient PI coins!");
        return prev;
      }
    });
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      loginWithPi,
      logout,
      plantings, setPlantings,
      maintenances, setMaintenances,
      harvests, setHarvests,
      utilizations, setUtilizations,
      cultivations, setCultivations,
      alertMessage, showAlert,
      generateId,
      updateUserStats,
      deductQuota,
      buyAiQuota
    }}>
      {children}
      {alertMessage && <div className="alert">{alertMessage}</div>}
    </AppContext.Provider>
  );
};
