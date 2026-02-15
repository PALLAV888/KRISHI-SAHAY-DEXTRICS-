
import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Loader2 } from 'lucide-react';

// Lazy loading pages for performance
const Home = lazy(() => import('./pages/Home'));
const Market = lazy(() => import('./pages/Market'));
const Schemes = lazy(() => import('./pages/Schemes'));
const Weather = lazy(() => import('./pages/Weather'));
const Chat = lazy(() => import('./pages/Chat'));
const VoiceAssistant = lazy(() => import('./pages/VoiceAssistant'));
const DiseaseDetection = lazy(() => import('./pages/DiseaseDetection'));
const FertilizerGuide = lazy(() => import('./pages/FertilizerGuide'));
const MachineryExchange = lazy(() => import('./pages/MachineryExchange'));

const LoadingScreen = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-emerald-800">
    <Loader2 className="w-10 h-10 animate-spin mb-4" />
    <p className="font-semibold tracking-wide">Growing intelligence...</p>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/market" element={<Market />} />
            <Route path="/schemes" element={<Schemes />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/voice-assistant" element={<VoiceAssistant />} />
            <Route path="/disease-detection" element={<DiseaseDetection />} />
            <Route path="/fertilizer-guide" element={<FertilizerGuide />} />
            <Route path="/machinery-exchange" element={<MachineryExchange />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
};

export default App;
