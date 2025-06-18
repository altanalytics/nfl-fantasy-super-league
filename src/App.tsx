import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Standings from './pages/Standings';
import Schedules from './pages/Schedules';
import LiveScoring from './pages/LiveScoring';
import './index.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/standings" element={<Standings />} />
        <Route path="/schedule" element={<Schedules />} />
        <Route path="/live-scoring" element={<LiveScoring />} />
      </Routes>
    </Router>
  );
}
