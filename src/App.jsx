import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import PortfolioProvider from './context/PortfolioContext';
import { Toaster } from 'react-hot-toast';
import GoogleAnalytics from './components/GoogleAnalytics';
import PortfolioEffects from './components/PortfolioEffects';
import ContentProtection from './components/ContentProtection';
import { Analytics } from '@vercel/analytics/react';

import { usePortfolio } from './context/PortfolioContext';

const AppLoader = ({ children }) => {
  const { isLoadingData } = usePortfolio();

  if (isLoadingData) {
    return (
      <div className="fixed inset-0 bg-deep-charcoal flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-emerald-500/80 font-mono text-sm animate-pulse">Loading Portfolio...</p>
        </div>
      </div>
    );
  }

  return children;
};

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
      <AppLoader>
        <Router>
          <GoogleAnalytics />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Router>
        <Analytics />
      </AppLoader>
    </PortfolioProvider>
  )
}

export default App
