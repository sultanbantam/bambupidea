import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppContext } from './context/AppContext';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Home from './pages/Home';
import Lifecycle from './pages/Lifecycle';
import Plant from './pages/Plant';
import PlantPast from './pages/PlantPast';
import Maintain from './pages/Maintain';
import Harvest from './pages/Harvest';
import Utilize from './pages/Utilize';
import Cultivate from './pages/Cultivate';
import AI from './pages/AI';
import BuildPage from './pages/BuildPage';
import Profile from './pages/Profile';

function App() {
  const { currentUser } = useContext(AppContext);

  if (!currentUser) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Lifecycle Routes */}
        <Route path="/lifecycle" element={<Lifecycle />} />
        <Route path="/lifecycle/plant" element={<Plant />} />
        <Route path="/lifecycle/plant-past" element={<PlantPast />} />
        <Route path="/lifecycle/maintain" element={<Maintain />} />
        <Route path="/lifecycle/harvest" element={<Harvest />} />
        <Route path="/lifecycle/utilize" element={<Utilize />} />
        <Route path="/lifecycle/cultivate" element={<Cultivate />} />
        
        {/* Other Bottom Nav Routes */}
        <Route path="/ai" element={<AI />} />
        <Route path="/build" element={<BuildPage />} />
        <Route path="/profile" element={<Profile />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
