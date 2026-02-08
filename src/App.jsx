import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Preferences } from '@capacitor/preferences';

// Import pages
import Dashboard from './Pages/Dashboard';
import NewRecord from './Pages/NewRecord'; 
import Account from './Pages/Account';
import Onboarding from './Pages/Onboarding'; // <-- Import your file

const LayoutWrapper = ({ children }) => (
  <div className="dark min-h-screen bg-black text-white">
    <main>{children}</main>
  </div>
);

function App() {
  const [isFirstTime, setIsFirstTime] = useState(null);

  useEffect(() => {
    const checkStatus = async () => {
      const { value } = await Preferences.get({ key: 'has_onboarded' });
      setIsFirstTime(value !== 'true'); // If value isn't 'true', it's their first time
    };
    checkStatus();
  }, []);

  // While the phone is "thinking," show a black screen
  if (isFirstTime === null) return <div className="bg-black min-h-screen" />;

  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          {/* THE LOGIC GATE: If it's the first time, "/" shows Onboarding. Otherwise, Dashboard. */}
          <Route 
            path="/" 
            element={isFirstTime ? <Onboarding /> : <Dashboard />} 
          />
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/new-record" element={<NewRecord />} />
          <Route path="/account" element={<Account />} />
          <Route path="/profile" element={<Account />} />
          
          <Route path="*" element={<div className="p-10 text-center text-white">Page Not Found</div>} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;