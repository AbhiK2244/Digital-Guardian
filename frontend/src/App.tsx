import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { DetectionTool } from './pages/DetectionTool';
import { LocalNews } from './pages/LocalNews';
import { BreachChecker } from './pages/BreachChecker';
import { Quiz } from './pages/Quiz';
import { Dashboard } from './pages/Dashboard';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/detect" element={<DetectionTool />} />
              <Route path="/local-news" element={<LocalNews />} />
              <Route path="/breach-check" element={<BreachChecker />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;