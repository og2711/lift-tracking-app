import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Import pages - ensure names match your actual files exactly
import Dashboard from './Pages/Dashboard';
import NewRecord from './Pages/NewRecord'; 
import Account from './Pages/Account';

const LayoutWrapper = ({ children }) => (
  <div className="dark min-h-screen bg-black text-white">
    <main>{children}</main>
  </div>
);

function App() {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new-record" element={<NewRecord />} />
          
          {/* THE FIX: Point BOTH paths to your Account page */}
          <Route path="/account" element={<Account />} />
          <Route path="/profile" element={<Account />} />
          
          <Route path="*" element={<div className="p-10 text-center text-white">Page Not Found</div>} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;