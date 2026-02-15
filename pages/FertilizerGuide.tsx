
import React, { useState } from 'react';
import { FlaskConical, Beaker, Sprout, Info, AlertTriangle, Loader2, Calculator, CheckCircle2, Leaf, ChevronDown } from 'lucide-react';
import { Crop, SoilType, GrowthStage } from '../types';
import { FERTILIZER_RULES, CROPS } from '../data/mockData';
import { getFertilizerAdvice } from '../services/geminiService';

const FertilizerGuide = () => {
  const [crop, setCrop] = useState<Crop>('Wheat');
  const [soil, setSoil] = useState<SoilType>('Loamy');
  const [stage, setStage] = useState<GrowthStage>('Sowing');
  const [area, setArea] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);

  const calculateRecommendation = async () => {
    setLoading(true);
    // Use fallback if crop not in rules
    const rule = FERTILIZER_RULES.find(r => r.crop === crop) || {
      crop: crop,
      n_ha: 100, p_ha: 50, k_ha: 50,
      timing: 'General basal dose at sowing.',
      organicAlternative: 'Farmyard Manure (FYM).'
    };

    // Soil multipliers
    let nMult = 1;
    if (soil === 'Sandy') nMult = 1.15; // Higher leaching
    if (soil === 'Clay') nMult = 0.85;  // Higher retention

    const toAcre = 2.471;
    const n_acre = (rule.n_ha * nMult) / toAcre;
    const p_acre = rule.p_ha / toAcre;
    const k_acre = rule.k_ha / toAcre;

    const totalN = (n_acre * area).toFixed(1);
    const totalP = (p_acre * area).toFixed(1);
    const totalK = (k_acre * area).toFixed(1);
    const npkStr = `${n_acre.toFixed(1)} : ${p_acre.toFixed(1)} : ${k_acre.toFixed(1)}`;
    
    try {
      const aiAdvice = await getFertilizerAdvice(crop, soil, stage, npkStr);
      setRecommendation({ ratio: npkStr, totalN, totalP, totalK, timing: rule.timing, organic: rule.organicAlternative, aiAdvice });
    } catch (err) {
      setRecommendation({ ratio: npkStr, totalN, totalP, totalK, timing: rule.timing, organic: rule.organicAlternative, aiAdvice: "AI Expert is currently offline." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 pb-20">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white font-serif">Smart Nutrient Planner</h1>
          <p className="text-gray-400 mt-1">Calculating precise NPK requirements for 25+ Indian crops based on soil health and growth phase.</p>
        </div>
        <div className="bg-emerald-900/30 px-4 py-2 rounded-xl border border-emerald-900/50 flex items-center gap-2 text-green-400 font-bold shadow-lg">
           <Calculator className="w-4 h-4" /> Nutrient Optimizer v2.0
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 bg-[#1F2937] p-8 rounded-3xl border border-white/5 shadow-2xl space-y-6">
          <h3 className="font-bold text-white flex items-center gap-2 text-green-500 uppercase tracking-widest text-xs">
            <Beaker className="w-5 h-5" /> Calculation Params
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Crop Selection</label>
              <div className="relative">
                <select 
                  value={crop} 
                  onChange={(e) => setCrop(e.target.value as Crop)}
                  className="w-full p-4 bg-[#111827] border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-green-500 transition-all font-bold appearance-none"
                >
                  {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Soil Type</label>
              <select value={soil} onChange={(e) => setSoil(e.target.value as SoilType)} className="w-full p-4 bg-[#111827] border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-green-500 transition-all font-bold">
                <option value="Loamy">Loamy (Recommended)</option>
                <option value="Sandy">Sandy (Low Retention)</option>
                <option value="Clay">Clay (Heavy Soil)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Land Area (Acres)</label>
              <input type="number" value={area} min={0.1} step={0.1} onChange={(e) => setArea(Number(e.target.value))} className="w-full p-4 bg-[#111827] border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-green-500 transition-all font-bold" />
            </div>
            <button onClick={calculateRecommendation} disabled={loading} className="w-full py-5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-[2rem] font-black text-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-green-900/40">
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <FlaskConical className="w-6 h-6" />} Compute Plan
            </button>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          {!recommendation && !loading && (
            <div className="h-full min-h-[500px] border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-8 bg-[#111827]/50">
              <FlaskConical className="w-16 h-16 text-gray-800 mb-4" />
              <h3 className="text-xl font-bold text-gray-500">Awaiting Computation</h3>
              <p className="text-gray-600 max-w-xs mt-2 italic font-medium">Define your soil and crop parameters to generate a national agronomist-standard plan.</p>
            </div>
          )}

          {loading && (
            <div className="space-y-6 animate-pulse p-10 bg-[#111827] rounded-[2.5rem]">
              <div className="h-20 bg-emerald-900/10 rounded-3xl"></div>
              <div className="h-40 bg-emerald-900/10 rounded-3xl"></div>
              <div className="h-24 bg-emerald-900/10 rounded-3xl"></div>
            </div>
          )}

          {recommendation && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-[#1F2937] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl p-10">
                <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-10">
                  <div>
                    <h2 className="text-[10px] font-black text-green-500 uppercase tracking-[0.3em] mb-3">Recommended NPK Base</h2>
                    <div className="flex items-end gap-3">
                      <div className="text-6xl font-black text-white">{recommendation.ratio}</div>
                      <div className="text-xs text-gray-500 font-bold mb-2 uppercase">kg / Acre</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 w-full md:w-auto">
                    <div className="bg-[#111827] p-5 rounded-3xl text-center border border-white/5 min-w-[100px]">
                      <div className="text-[10px] font-bold text-gray-500 uppercase mb-2">Nitrogen</div>
                      <div className="text-2xl font-black text-white">{recommendation.totalN}kg</div>
                    </div>
                    <div className="bg-[#111827] p-5 rounded-3xl text-center border border-white/5 min-w-[100px]">
                      <div className="text-[10px] font-bold text-gray-500 uppercase mb-2">Phosp.</div>
                      <div className="text-2xl font-black text-white">{recommendation.totalP}kg</div>
                    </div>
                    <div className="bg-[#111827] p-5 rounded-3xl text-center border border-white/5 min-w-[100px]">
                      <div className="text-[10px] font-bold text-gray-500 uppercase mb-2">Potash</div>
                      <div className="text-2xl font-black text-white">{recommendation.totalK}kg</div>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-emerald-950/20 rounded-3xl border border-emerald-500/20 flex gap-5">
                   <Info className="w-6 h-6 text-emerald-500 shrink-0 mt-1" />
                   <div>
                     <h4 className="font-black text-emerald-400 text-sm uppercase tracking-widest mb-1">Schedule</h4>
                     <p className="text-gray-300 leading-relaxed font-medium">{recommendation.timing}</p>
                   </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#111827] to-[#1F2937] rounded-[2.5rem] border border-white/5 shadow-2xl p-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                  <Sprout size={180} />
                </div>
                <h3 className="flex items-center gap-3 text-2xl font-black text-white mb-6">
                  <Leaf className="w-7 h-7 text-green-500" /> AI Agronomist Deep-Dive
                </h3>
                <div className="prose prose-invert max-w-none">
                   <div className="text-gray-300 leading-relaxed whitespace-pre-wrap text-lg italic">
                     {recommendation.aiAdvice}
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FertilizerGuide;
