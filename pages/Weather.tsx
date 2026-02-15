
import React, { useState, useEffect } from 'react';
import { CloudSun, Wind, Droplets, Thermometer, AlertTriangle, Info, MapPin, Loader2, CheckCircle2, Navigation, Search } from 'lucide-react';
import { WeatherData, CropStage, State } from '../types';
import { STATES } from '../data/mockData';

const Weather = () => {
  const [selectedState, setSelectedState] = useState<State>('Delhi' as State); // Defaulting to something common
  const [locationName, setLocationName] = useState('New Delhi');
  const [stage, setStage] = useState<CropStage>('Flowering');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async (target: string) => {
    setLoading(true);
    setError('');
    const apiKey = "60a7d5fa00b852776a0009dc8ff094ca";
    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(target)}&appid=${apiKey}&units=metric`);
      if (res.status === 401) throw new Error('Invalid API Key.');
      const data = await res.json();
      if (data.cod !== 200) throw new Error(data.message || 'Location not found');
      setWeather({
        temp: Math.round(data.main.temp),
        humidity: data.main.humidity,
        description: data.weather[0].description,
        rainProbability: data.clouds?.all || 0,
        city: data.name,
        icon: data.weather[0].icon
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWeather(locationName); }, []);

  const getAdvisory = () => {
    if (!weather) return null;
    const advisories = [];
    
    // Logic Improvements
    if (weather.rainProbability > 60) {
      advisories.push({ type: 'danger', msg: 'High probability of rain. Avoid irrigation today and postpone any scheduled pesticide spraying.' });
    }
    if (weather.temp > 38) {
      advisories.push({ type: 'danger', msg: 'Critical heat stress alert. Ensure extra evening irrigation and check for heat stroke signs in livestock.' });
    } else if (weather.temp > 35) {
      advisories.push({ type: 'warning', msg: 'Extreme heat risk. Increase evening irrigation frequency by 20% to prevent wilting.' });
    }
    if (weather.humidity > 80) {
      advisories.push({ type: 'warning', msg: 'High humidity detected. Significant risk of fungal diseases (Mildew/Blast). Monitor crops closely.' });
    }
    
    if (stage === 'Flowering' && weather.rainProbability > 40) {
      advisories.push({ type: 'info', msg: 'Flowering phase is sensitive to waterlogging. Ensure proper field drainage.' });
    }

    return advisories.length > 0 ? advisories : [{ type: 'success', msg: 'Current conditions are optimal for your crop growth cycle.' }];
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white font-serif">National Weather Engine</h1>
          <p className="text-gray-400 mt-1">Micro-climate monitoring and AI advisories for precise farm management across India.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 bg-[#1F2937] p-8 rounded-3xl border border-white/5 shadow-2xl space-y-8">
          <div className="flex items-center gap-3 text-green-500 font-bold uppercase tracking-widest text-[10px]">
            <Navigation className="w-4 h-4" /> Location Configuration
          </div>
          
          <form onSubmit={(e) => { e.preventDefault(); fetchWeather(`${locationName}, ${selectedState}`); }} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-3">State</label>
              <select 
                value={selectedState} 
                onChange={(e) => setSelectedState(e.target.value as State)}
                className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3.5 text-white font-semibold outline-none focus:ring-2 focus:ring-green-500 transition-all"
              >
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-3">District / City</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                <input 
                  type="text" 
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full bg-[#111827] border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white outline-none focus:ring-2 focus:ring-green-500 transition-all font-semibold"
                  placeholder="Enter city or district..."
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Current Crop Phase</label>
              <select 
                value={stage} 
                onChange={(e) => setStage(e.target.value as CropStage)}
                className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3.5 text-white font-semibold outline-none focus:ring-2 focus:ring-green-500 transition-all"
              >
                <option value="Sowing">Sowing / Planting</option>
                <option value="Flowering">Flowering / Fruit Setting</option>
                <option value="Harvest">Harvesting / Post-Harvest</option>
              </select>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-green-700 to-green-500 text-white rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-green-900/40"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <CloudSun className="w-6 h-6" />}
              Fetch Live Status
            </button>
          </form>

          {error && (
            <div className="p-4 bg-red-950/30 text-red-400 border border-red-500/30 rounded-2xl text-xs flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0" /> {error}
            </div>
          )}
        </div>

        <div className="lg:col-span-8 space-y-6">
          {weather && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-[2.5rem] p-10 lg:p-14 border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-green-500/15 transition-all"></div>
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                       <MapPin className="w-4 h-4 text-green-500" />
                       <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{weather.city}, {selectedState}</span>
                    </div>
                    <div className="text-7xl lg:text-9xl font-black tracking-tighter text-white mb-2 flex items-start">
                      {weather.temp}<span className="text-4xl lg:text-5xl text-green-500 mt-4 ml-2">°C</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-400 capitalize">{weather.description}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-5 rounded-3xl border border-white/5 backdrop-blur-xl">
                      <Droplets className="w-5 h-5 text-blue-400 mb-2" />
                      <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Humidity</div>
                      <div className="text-xl font-bold">{weather.humidity}%</div>
                    </div>
                    <div className="bg-white/5 p-5 rounded-3xl border border-white/5 backdrop-blur-xl">
                      <CloudSun className="w-5 h-5 text-amber-500 mb-2" />
                      <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Precipitation</div>
                      <div className="text-xl font-bold">{weather.rainProbability}%</div>
                    </div>
                    <div className="bg-white/5 p-5 rounded-3xl border border-white/5 backdrop-blur-xl">
                      <Wind className="w-5 h-5 text-emerald-400 mb-2" />
                      <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Wind Speed</div>
                      <div className="text-xl font-bold">18<span className="text-xs ml-1">km/h</span></div>
                    </div>
                    <div className="bg-white/5 p-5 rounded-3xl border border-white/5 backdrop-blur-xl">
                      <Thermometer className="w-5 h-5 text-red-400 mb-2" />
                      <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Feels Like</div>
                      <div className="text-xl font-bold">{weather.temp + 2}°</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#1F2937] rounded-3xl p-10 border border-white/5 shadow-2xl">
                 <div className="flex items-center justify-between mb-8">
                   <h3 className="text-xl font-bold text-white flex items-center gap-3">
                     <Info className="w-6 h-6 text-green-500" /> Regional Advisory Feed
                   </h3>
                 </div>
                 <div className="space-y-4">
                   {getAdvisory()?.map((adv, i) => (
                     <div key={i} className={`p-6 rounded-2xl flex items-start gap-5 border transition-all ${
                       adv.type === 'danger' ? 'bg-red-950/20 border-red-500/20 text-red-400' :
                       adv.type === 'warning' ? 'bg-amber-950/20 border-amber-600/20 text-amber-500' :
                       adv.type === 'info' ? 'bg-blue-950/20 border-blue-500/20 text-blue-400' :
                       'bg-green-950/20 border-green-500/20 text-green-400'
                     }`}>
                       <div className="p-2.5 rounded-xl bg-current opacity-10 shrink-0">
                         {adv.type === 'danger' || adv.type === 'warning' ? <AlertTriangle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                       </div>
                       <div className="font-semibold leading-relaxed text-base md:text-lg">{adv.msg}</div>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Weather;
