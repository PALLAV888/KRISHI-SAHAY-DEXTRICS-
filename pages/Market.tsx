
import React, { useState, useEffect, useMemo } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { MARKET_DATA, getMockMarketData, STATES, CROPS } from '../data/mockData';
import { Crop, State, MarketData as MarketDataType } from '../types';
import { TrendingUp, TrendingDown, LayoutGrid, Info, ChevronDown, RefreshCw, ExternalLink, Loader2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { getLiveMarketInsights } from '../services/geminiService';

const Market = () => {
  const [selectedCrop, setSelectedCrop] = useState<Crop>('Tomato');
  const [selectedState, setSelectedState] = useState<State>('Maharashtra');
  const [liveAIInsights, setLiveAIInsights] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Find or generate market data
  const currentMarketData = useMemo((): MarketDataType => {
    const existing = MARKET_DATA.find(d => d.crop === selectedCrop && d.state === selectedState);
    return existing || getMockMarketData(selectedCrop, selectedState);
  }, [selectedCrop, selectedState]);

  const chartData = useMemo(() => {
    return currentMarketData.prices.map((price, i) => ({
      day: `Day ${i + 1}`,
      price
    }));
  }, [currentMarketData]);

  const handleFetchLiveMarket = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await getLiveMarketInsights(selectedCrop, selectedState);
      setLiveAIInsights(result);
    } catch (err) {
      setError("Unable to connect to eNAM live stream. Displaying estimated data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleFetchLiveMarket();
  }, [selectedCrop, selectedState]);

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white font-serif">National Market Engine</h1>
          <p className="text-gray-400 mt-1">Cross-state Mandi price monitoring powered by eNAM (National Agricultural Market).</p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="relative min-w-[180px]">
            <select 
              value={selectedState} 
              onChange={(e) => setSelectedState(e.target.value as State)}
              className="w-full appearance-none bg-[#1F2937] border border-white/10 text-white pl-4 pr-10 py-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none cursor-pointer font-semibold shadow-xl"
            >
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
          <div className="relative min-w-[150px]">
            <select 
              value={selectedCrop} 
              onChange={(e) => setSelectedCrop(e.target.value as Crop)}
              className="w-full appearance-none bg-[#1F2937] border border-white/10 text-white pl-4 pr-10 py-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none cursor-pointer font-semibold shadow-xl"
            >
              {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
          <button 
            onClick={handleFetchLiveMarket}
            disabled={isLoading}
            className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-green-500 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Pricing Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#1F2937] p-6 rounded-2xl border border-white/5 shadow-xl">
           <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Modal Price</div>
           <div className="text-3xl font-black text-white flex items-center gap-2">
              ₹{currentMarketData.modalPrice}
              {currentMarketData.trend === 'up' ? <ArrowUpRight className="text-green-500 w-6 h-6" /> : <ArrowDownRight className="text-red-500 w-6 h-6" />}
           </div>
           <div className="text-xs text-gray-400 mt-2">Per Quintal (100kg)</div>
        </div>
        <div className="bg-[#1F2937] p-6 rounded-2xl border border-white/5 shadow-xl">
           <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Min Price</div>
           <div className="text-3xl font-black text-gray-300">₹{currentMarketData.minPrice}</div>
           <div className="text-xs text-gray-400 mt-2">Historical low for this week</div>
        </div>
        <div className="bg-[#1F2937] p-6 rounded-2xl border border-white/5 shadow-xl">
           <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Max Price</div>
           <div className="text-3xl font-black text-green-400">₹{currentMarketData.maxPrice}</div>
           <div className="text-xs text-gray-400 mt-2">Historical high for this week</div>
        </div>
        <div className="bg-[#1F2937] p-6 rounded-2xl border border-white/5 shadow-xl">
           <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Region Reach</div>
           <div className="text-3xl font-black text-white">{selectedState}</div>
           <div className="text-xs text-gray-400 mt-2">Monitoring active in 42 Mandis</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          {/* AI Insights Container */}
          <div className="bg-[#1F2937] rounded-3xl border border-white/5 shadow-2xl overflow-hidden min-h-[300px]">
            <div className="px-8 py-6 border-b border-white/5 bg-[#111827]/50 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-500" /> AI Strategic Analysis
              </h2>
            </div>
            <div className="p-8">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-12 h-12 text-green-500 animate-spin mb-4" />
                  <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Deep Analysis in Progress...</p>
                </div>
              ) : liveAIInsights ? (
                <div className="space-y-6 animate-fade-in">
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 leading-relaxed text-lg italic">
                      {liveAIInsights.text}
                    </p>
                  </div>
                  {liveAIInsights.sources?.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-4">
                      {liveAIInsights.sources.map((chunk: any, i: number) => (
                        chunk.web && (
                          <a key={i} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-[#111827] border border-white/10 rounded-lg text-[10px] font-bold text-green-500 hover:border-green-500 transition-all flex items-center gap-2">
                            <ExternalLink className="w-3 h-3" /> {chunk.web.title || 'Mandi Details'}
                          </a>
                        )
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 opacity-20">
                  <LayoutGrid size={64} />
                  <p className="mt-4 font-bold">Select parameters to start analysis</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#1F2937] p-8 rounded-3xl border border-white/5 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-6">Historical Price Curve (Weekly)</h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" opacity={0.05} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                  <Area type="monotone" dataKey="price" stroke="#22c55e" strokeWidth={4} fillOpacity={1} fill="url(#colorPrice)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-green-900/20 to-green-950/40 p-8 rounded-3xl border border-green-500/20 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Mandi Checklist</h3>
            <ul className="space-y-4">
              {[
                "Verify Aadhar-linked bank account",
                "Moisture content check (< 12%)",
                "Grade selection (Quality A/B)",
                "Transport logistics pre-booking"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <button className="w-full mt-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-bold shadow-xl transition-all flex items-center justify-center gap-2">
              <ExternalLink className="w-4 h-4" /> Go to eNAM Portal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Market;
