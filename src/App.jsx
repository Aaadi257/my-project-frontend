import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ScorecardForm from './components/ScorecardForm';
import ScoreResult from './components/ScoreResult';
import Leaderboard from './components/Leaderboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/new" element={<ScorecardForm />} />
        <Route path="/result" element={<ScoreResult />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
}

export default App;
