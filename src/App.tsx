import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import StarBackground from '@/components/StarBackground';
import RollPage from '@/pages/RollPage';
import RecordsPage from '@/pages/RecordsPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import DailyPage from '@/pages/DailyPage';
import DiceSetsPage from '@/pages/DiceSetsPage';
import DiceSetEditPage from '@/pages/DiceSetEditPage';
import KnowledgeBasePage from '@/pages/KnowledgeBasePage';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-indigo-950 text-white overflow-x-hidden">
        <StarBackground />
        <Navbar />
        <Routes>
          <Route path="/" element={<RollPage />} />
          <Route path="/daily" element={<DailyPage />} />
          <Route path="/dice-sets" element={<DiceSetsPage />} />
          <Route path="/dice-sets/edit/:id" element={<DiceSetEditPage />} />
          <Route path="/knowledge" element={<KnowledgeBasePage />} />
          <Route path="/records" element={<RecordsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </div>
    </Router>
  );
}
