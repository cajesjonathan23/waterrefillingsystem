import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Store from './components/Store';
import Admin from './components/Admin';
import TrackOrder from './components/TrackOrder';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Store />} />
        <Route path="/track" element={<TrackOrder />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;