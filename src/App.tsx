import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EmailGate from './components/EmailGate';
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
        <Route path="/standings" element={<EmailGate><Standings /></EmailGate>} />
        <Route path="/schedule" element={<EmailGate><Schedules /></EmailGate>} />
        <Route path="/live-scoring" element={<EmailGate><LiveScoring /></EmailGate>} />
      </Routes>
    </Router>
  );
}
