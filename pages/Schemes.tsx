
import React, { useState, useEffect, useMemo } from 'react';
import { State, Crop, Scheme as SchemeType } from '../types';
import { SCHEMES, STATES, CROPS } from '../data/mockData';
import { ShieldCheck, Search, LayoutGrid, Loader2, ExternalLink, Info, CheckCircle2, RefreshCw, Landmark } from 'lucide-react';
import { getLiveSchemes } from '../services/geminiService';

const Schemes = () => {
  const [landSize, setLandSize] = useState<number>(0);
  const [ownsLand, setOwnsLand] = useState<boolean>(true);
  const [selectedState, setSelectedState] = useState<State>('Maharashtra');
  const [selectedCrop, setSelectedCrop] = useState<Crop>('Wheat');
  const [liveAIAnalysis, setLiveAIAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Local filtering logic for mock schemes
  const eligibleMockSchemes = useMemo(() => {
    return SCHEMES.filter(scheme => {
      // If state restricted, must match selected state
      if (scheme.states && !scheme.states.includes(selectedState)) return false;
      return true;
    });
  }, [selectedState]);

  const fetchLiveAIAdvice = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await getLiveSchemes(selectedCrop, selectedState);
      setLiveAIAnalysis(result);
    } catch (err) {
      setError("Failed to fetch live schemes from central portal. Showing regional data.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fixed: Corrected function call to fetchLiveAIAdvice to match its definition.
  useEffect(() => {
    fetchLiveAIAdvice();
  }, [selectedCrop, selectedState]);

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white font-serif">National Support Ecosystem</h1>
          <p className="text-gray-400 mt-1">Cross-referencing central schemes with {selectedState}-specific agricultural programs.</p>
        </div>
        <button 
          onClick={fetchLiveAIAdvice}
          disabled={isLoading}
          className="bg-[#1F2937] px-6 py-3 rounded-2xl border border-white/5 flex items-center gap-3 text-green-400 font-bold shadow-xl hover:bg-white/5 transition-all disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
          Refresh AI Matching
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 bg-[#1F2937] p-8 rounded-3xl border border-white/5 shadow-2xl space-y-8">
          <div className="flex items-center gap-3 text-green-500 font-bold uppercase tracking-widest text-[10px]">
            <Landmark className="w-4 h-4" /> Eligibility Profile
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-3">State Domicile</label>
              <select 
                value={selectedState} 
                onChange={(e) => setSelectedState(e.target.value as State)}
                className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3.5 text-white font-semibold outline-none focus:ring-2 focus:ring-green-500"
              >
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Land Size (Acres)</label>
              <input 
                type="number" 
                value={landSize}
                onChange={(e) => setLandSize(Number(e.target.value))}
                className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:ring-2 focus:ring-green-500 transition-all font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Primary Crop</label>
              <select 
                value={selectedCrop} 
                onChange={(e) => setSelectedCrop(e.target.value as Crop)}
                className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3.5 text-white font-semibold outline-none focus:ring-2 focus:ring-green-500"
              >
                {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-8">
          {/* AI Intelligence Card */}
          <div className="bg-[#1F2937] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl p-10">
            <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-green-500" /> AI Matched Live Database
            </h2>
            {isLoading ? (
              <div className="py-20 flex flex-col items-center">
                <Loader2 className="w-12 h-12 text-green-500 animate-spin mb-4" />
                <p className="text-gray-500 uppercase font-black tracking-widest text-[10px]">Scanning data.gov.in & myScheme portals...</p>
              </div>
            ) : liveAIAnalysis ? (
              <div className="space-y-6">
                <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">{liveAIAnalysis.text}</p>
                {liveAIAnalysis.sources?.length > 0 && (
                  <div className="flex flex-wrap gap-3 pt-6 border-t border-white/5">
                    {liveAIAnalysis.sources.map((chunk: any, i: number) => (
                      chunk.web && (
                        <a key={i} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="px-5 py-3 bg-[#111827] border border-white/10 rounded-xl text-sm text-green-500 hover:bg-green-500/10 transition-all flex items-center gap-3">
                          <ExternalLink className="w-4 h-4" /> <span className="font-bold">{chunk.web.title || 'Official Portal'}</span>
                        </a>
                      )
                    ))}
                  </div>
                )}
              </div>
            ) : <p className="text-gray-500 italic">No live analysis available yet. Refresh to match.</p>}
          </div>

          {/* Core Matching List */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest pl-2">Static Regional Matching</h3>
            {eligibleMockSchemes.map((scheme) => (
              <div key={scheme.id} className="bg-[#1F2937] p-8 rounded-3xl border border-white/5 hover:border-green-500/20 transition-all group">
                <div className="flex justify-between items-start gap-4 mb-6">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                        <Landmark className="w-6 h-6 text-blue-500" />
                      </div>
                      <h4 className="text-xl font-bold text-white">{scheme.name}</h4>
                   </div>
                   {scheme.states && <span className="px-3 py-1 bg-amber-950/20 border border-amber-500/30 text-amber-500 rounded-lg text-[10px] font-bold uppercase">{selectedState} Only</span>}
                </div>
                <p className="text-gray-400 mb-6 leading-relaxed">{scheme.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                   <div>
                     <h5 className="text-[10px] font-bold text-gray-500 uppercase mb-3">Eligibility</h5>
                     <ul className="space-y-2">
                        {scheme.eligibilityRules.map((rule, i) => (
                          <li key={i} className="text-sm text-gray-300 flex items-center gap-2"><div className="w-1 h-1 bg-green-500 rounded-full" /> {rule}</li>
                        ))}
                     </ul>
                   </div>
                   <div>
                     <h5 className="text-[10px] font-bold text-gray-500 uppercase mb-3">Required Documents</h5>
                     <ul className="space-y-2">
                        {scheme.requiredDocuments.map((doc, i) => (
                          <li key={i} className="text-sm text-gray-300 flex items-center gap-2"><div className="w-1 h-1 bg-blue-500 rounded-full" /> {doc}</li>
                        ))}
                     </ul>
                   </div>
                </div>
                <a href={scheme.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-green-500 font-bold hover:underline">Apply Now <ExternalLink className="w-4 h-4" /></a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schemes;
