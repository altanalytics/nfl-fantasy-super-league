import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LeagueInfo from './pages/LeagueInfo';
import LiveScoring from './pages/LiveScoring';
import './index.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/league-info" element={<LeagueInfo />} />
        <Route path="/live-scoring" element={<LiveScoring />} />
      </Routes>
    </Router>
  );
}
