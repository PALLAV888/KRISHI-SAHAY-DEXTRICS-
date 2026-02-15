
import React from 'react';
import { Link } from 'react-router-dom';
// Added Mic icon to the imports from lucide-react
import { BarChart3, ShieldCheck, CloudSun, ArrowRight, Camera, FlaskConical, LayoutGrid, Zap, Mic } from 'lucide-react';

const QuickInsightCard = ({ icon: Icon, title, value, status, to, color }: any) => (
  <Link to={to} className="bg-[#1F2937] p-6 rounded-2xl border border-white/5 hover:border-green-500/30 transition-all duration-300 group hover:scale-[1.02] shadow-xl relative overflow-hidden">
    <div className={`absolute -right-4 -bottom-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-500`}>
      <Icon size={120} />
    </div>
    <div className="flex items-start justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="flex items-center gap-1.5 px-2 py-1 bg-[#111827] rounded-full border border-white/5">
        <div className={`w-1.5 h-1.5 rounded-full ${status === 'Active' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{status}</span>
      </div>
    </div>
    <h3 className="text-sm font-semibold text-gray-400 mb-1">{title}</h3>
    <div className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">{value}</div>
  </Link>
);

const Home = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-green-950 via-[#0F172A] to-green-900/20 p-8 lg:p-20 border border-white/5">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-900/20 rounded-full border border-green-500/30 text-green-400 text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in">
            <Zap className="w-3 h-3" /> Next-Gen Ag Intelligence
          </div>
          <h1 className="text-5xl lg:text-7xl font-serif text-white mb-6 leading-tight">
            From Data to Decision — <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 italic">Precision Farming</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-2xl">
            Empower your farm with AI-driven insights. From market price forecasting to real-time disease scanning, KrishiSahay is your digital partner in growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/market" className="px-8 py-4 bg-gradient-to-r from-green-700 to-green-500 text-white rounded-full font-bold shadow-2xl shadow-green-900/40 hover:scale-105 transition-all text-center flex items-center justify-center gap-2 group">
              Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/chat" className="px-8 py-4 bg-white/5 backdrop-blur-xl text-white border border-white/10 rounded-full font-bold hover:bg-white/10 transition-all text-center">
              Talk to AI Expert
            </Link>
          </div>
        </div>
        
        {/* Abstract shapes */}
        <div className="absolute top-1/2 -right-20 -translate-y-1/2 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      </section>

      {/* Quick Insights Grid */}
      <section>
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-green-500" /> Farm Pulse
          </h2>
          <span className="text-xs text-gray-500 font-medium">Real-time status updates</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <QuickInsightCard 
            icon={BarChart3}
            title="Market Trend"
            value="Bullish (+4.2%)"
            status="Active"
            to="/market"
            color="bg-emerald-600 shadow-lg shadow-emerald-900/20"
          />
          <QuickInsightCard 
            icon={CloudSun}
            title="Weather Advisory"
            value="Optimal Sowing"
            status="Active"
            to="/weather"
            color="bg-blue-600 shadow-lg shadow-blue-900/20"
          />
          <QuickInsightCard 
            icon={ShieldCheck}
            title="Available Schemes"
            value="12 Matching"
            status="Active"
            to="/schemes"
            color="bg-amber-600 shadow-lg shadow-amber-900/20"
          />
          <QuickInsightCard 
            icon={Camera}
            title="Disease Scanning"
            value="Ready to Scan"
            status="Idle"
            to="/disease-detection"
            color="bg-red-600 shadow-lg shadow-red-900/20"
          />
        </div>
      </section>

      {/* Main Feature Cards */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#1F2937] rounded-3xl p-8 border border-white/5 relative group hover:border-green-500/20 transition-all">
          <div className="flex flex-col h-full">
            <div className="w-14 h-14 bg-green-600/10 rounded-2xl flex items-center justify-center mb-6 border border-green-500/20 group-hover:scale-110 transition-transform">
              <FlaskConical className="w-7 h-7 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Precision Nutrient Guide</h3>
            <p className="text-gray-400 mb-8 flex-grow">
              Stop guessing. Calculate exact fertilizer requirements for your soil type and target yield with our agronomist AI model.
            </p>
            <Link to="/fertilizer-guide" className="inline-flex items-center gap-2 text-green-500 font-bold hover:gap-3 transition-all">
              Launch Guide <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="bg-[#1F2937] rounded-3xl p-8 border border-white/5 relative group hover:border-green-500/20 transition-all overflow-hidden">
           <div className="absolute top-0 right-0 w-48 h-48 bg-green-500/5 blur-[60px] pointer-events-none"></div>
           <div className="flex flex-col h-full">
            <div className="w-14 h-14 bg-amber-600/10 rounded-2xl flex items-center justify-center mb-6 border border-amber-500/20 group-hover:scale-110 transition-transform">
              <Mic className="w-7 h-7 text-amber-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Multilingual Voice Support</h3>
            <p className="text-gray-400 mb-8 flex-grow">
              Get advice in Hindi, English, or Hinglish. Our voice assistant is designed for eyes-free operation on the field.
            </p>
            <Link to="/voice-assistant" className="inline-flex items-center gap-2 text-amber-500 font-bold hover:gap-3 transition-all">
              Start Speaking <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
