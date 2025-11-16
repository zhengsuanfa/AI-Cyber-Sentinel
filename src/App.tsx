import { useState } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { Layout } from './components/Layout';
import { Home } from './components/pages/Home';
import { VulnerabilityAnalysis } from './components/pages/VulnerabilityAnalysis';
import { CyberDefenseTranslated } from './components/pages/CyberDefenseTranslated';
import { LearningCenter } from './components/pages/LearningCenter';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'vulnerability':
        return <VulnerabilityAnalysis />;
      case 'defense':
        return <CyberDefenseTranslated />;
      case 'learning':
        return <LearningCenter />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <LanguageProvider>
      <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
        {renderPage()}
      </Layout>
    </LanguageProvider>
  );
}