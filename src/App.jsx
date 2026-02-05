import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import PortfolioProvider from './context/PortfolioContext';
import { Toaster } from 'react-hot-toast';
import GoogleAnalytics from './components/GoogleAnalytics';
import PortfolioEffects from './components/PortfolioEffects';
import ContentProtection from './components/ContentProtection';

function App() {
  return (
    <PortfolioProvider>
      <ContentProtection />
      <PortfolioEffects />
      <Toaster position="top-right" toastOptions={{
        className: 'bg-zinc-900 border border-white/10 text-white',
        style: {
          background: '#18181b',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: 'white',
          },
        },
      }} />
      <Router>
        <GoogleAnalytics />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </PortfolioProvider>
  )
}

export default App
