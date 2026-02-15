
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Sprout, BarChart3, CloudSun, ShieldCheck, MessageSquare, Mic, Menu, X, Camera, FlaskConical, ChevronRight, Truck } from 'lucide-react';

const SidebarItem = ({ to, label, icon, onClick }: { to: string; label: string; icon: React.ReactNode; onClick?: () => void }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 group ${
          isActive 
            ? 'bg-gradient-to-r from-green-800 to-green-600 text-white shadow-lg shadow-green-900/40 translate-x-1' 
            : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`
      }
    >
      <span className="shrink-0 transition-transform duration-300 group-hover:scale-110">{icon}</span>
      <span className="flex-grow">{label}</span>
      <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 transition-all group-hover:opacity-40 group-hover:translate-x-0" />
    </NavLink>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.title = "KrishiSahay — AI Powered Agricultural Intelligence";
    window.scrollTo(0, 0);
  }, [location]);

  const navLinks = [
    { to: '/', label: 'Home', icon: <Sprout className="w-5 h-5" /> },
    { to: '/market', label: 'Market Analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { to: '/schemes', label: 'Govt Schemes', icon: <ShieldCheck className="w-5 h-5" /> },
    { to: '/weather', label: 'Weather Advisor', icon: <CloudSun className="w-5 h-5" /> },
    { to: '/disease-detection', label: 'Disease Scanner', icon: <Camera className="w-5 h-5" /> },
    { to: '/fertilizer-guide', label: 'Nutrient Guide', icon: <FlaskConical className="w-5 h-5" /> },
    { to: '/machinery-exchange', label: 'Machinery Exchange', icon: <Truck className="w-5 h-5" /> },
    { to: '/chat', label: 'AI Support', icon: <MessageSquare className="w-5 h-5" /> },
    { to: '/voice-assistant', label: 'Voice Assistant', icon: <Mic className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-gray-100 flex overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden xl:flex flex-col w-72 bg-[#111827] border-r border-white/5 fixed inset-y-0 left-0 z-50 p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-900/30">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white font-serif">KrishiSahay</span>
        </div>

        <nav className="flex-grow space-y-1">
          {navLinks.map((link) => (
            <SidebarItem key={link.to} {...link} />
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          <div className="bg-[#1F2937] p-4 rounded-2xl border border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center text-emerald-400 font-bold">
              K
            </div>
            <div>
              <div className="text-xs font-bold text-white">Kisan Support</div>
              <div className="text-[10px] text-gray-400">ID: #9283-SAFE</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Nav */}
      <div className="xl:hidden fixed top-0 left-0 right-0 bg-[#111827]/80 backdrop-blur-xl border-b border-white/5 z-50 h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Sprout className="w-7 h-7 text-green-500" />
          <span className="text-lg font-bold text-white font-serif">KrishiSahay</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-gray-400 hover:text-white"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[60] xl:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-[#111827] p-6 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Sprout className="w-7 h-7 text-green-500" />
                <span className="text-lg font-bold text-white">KrishiSahay</span>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400"><X /></button>
            </div>
            <nav className="space-y-1">
              {navLinks.map((link) => (
                <SidebarItem key={link.to} {...link} onClick={() => setIsSidebarOpen(false)} />
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow xl:ml-72 pt-16 xl:pt-0 min-h-screen">
        <div className="p-4 md:p-8 lg:p-12 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};
