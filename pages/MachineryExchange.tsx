
import React, { useState, useMemo } from 'react';
import { Truck, MapPin, Search, Calendar, LayoutGrid, CheckCircle2, Info, Star, Plus, Loader2, DollarSign, User, Zap, AlertTriangle } from 'lucide-react';
import { EquipmentType, MachineryListing } from '../types';
import { getMachineryCostAdvice } from '../services/geminiService';

const MOCK_LISTINGS: MachineryListing[] = [
  { id: '1', type: 'Tractor', model: 'John Deere 5050D', owner: 'Ramesh Kumar', distance: 3.2, cost: 500, status: 'Available', rating: 4.8, contact: '9876543210', location: 'Maharashtra' },
  { id: '2', type: 'Harvester', model: 'Mahindra Arjun Novo', owner: 'Suresh Singh', distance: 5.5, cost: 1200, status: 'Available', rating: 4.5, contact: '8765432109', location: 'UP' },
  { id: '3', type: 'Seeder', model: 'Maschio Gaspardo', owner: 'Amit Patel', distance: 1.2, cost: 300, status: 'Booked', rating: 4.9, contact: '7654321098', location: 'Punjab' },
  { id: '4', type: 'Sprayer', model: 'ASPEE Duo', owner: 'Vikram Joshi', distance: 4.8, cost: 150, status: 'Available', rating: 4.2, contact: '6543210987', location: 'Maharashtra' },
  { id: '5', type: 'Rotavator', model: 'Fieldking Multi Speed', owner: 'Prakash Deshmukh', distance: 2.7, cost: 400, status: 'Available', rating: 4.6, contact: '5432109876', location: 'Maharashtra' },
];

const MachineryExchange = () => {
  const [activeTab, setActiveTab] = useState<'browse' | 'list'>('browse');
  const [listings, setListings] = useState<MachineryListing[]>(MOCK_LISTINGS);
  const [filters, setFilters] = useState({
    location: '',
    type: '' as EquipmentType | '',
    acres: 1,
    duration: '1 Day'
  });
  
  const [newListing, setNewListing] = useState({
    type: 'Tractor' as EquipmentType,
    model: '',
    cost: 0,
    location: '',
    availability: '',
    contact: ''
  });

  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const filteredListings = useMemo(() => {
    return listings.filter(l => {
      const matchLoc = !filters.location || l.location.toLowerCase().includes(filters.location.toLowerCase());
      const matchType = !filters.type || l.type === filters.type;
      return matchLoc && matchType;
    });
  }, [listings, filters]);

  const handleListSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const listing: MachineryListing = {
      id: Math.random().toString(36).substr(2, 9),
      ...newListing,
      owner: 'Current User', // Mock owner
      distance: 0,
      status: 'Available',
      rating: 5.0,
    };
    setListings([listing, ...listings]);
    setToast('Equipment listed successfully!');
    setTimeout(() => setToast(null), 3000);
    setActiveTab('browse');
    setNewListing({ type: 'Tractor', model: '', cost: 0, location: '', availability: '', contact: '' });
  };

  const runAiAnalysis = async (listing: MachineryListing) => {
    setIsAiLoading(true);
    setAiAdvice(null);
    try {
      const advice = await getMachineryCostAdvice(listing.type, filters.acres, filters.duration, listing.cost);
      setAiAdvice(advice);
    } catch (err) {
      console.error(err);
      setAiAdvice("Unable to fetch AI advice. Please check your connection.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {toast && (
        <div className="fixed top-24 right-8 bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl z-[100] animate-bounce font-bold border border-green-500/50">
          <CheckCircle2 className="inline-block mr-2 w-5 h-5" /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white font-serif">Machinery Exchange</h1>
          <p className="text-gray-400 mt-2">Rent or Share Farm Equipment Smartly across Rural Communities.</p>
        </div>
        
        <div className="flex p-1 bg-[#1F2937] rounded-2xl border border-white/5 shadow-xl">
          <button 
            onClick={() => setActiveTab('browse')}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'browse' ? 'bg-green-600 text-white shadow-lg shadow-green-900/40' : 'text-gray-400 hover:text-white'}`}
          >
            Browse Machinery
          </button>
          <button 
            onClick={() => setActiveTab('list')}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'list' ? 'bg-green-600 text-white shadow-lg shadow-green-900/40' : 'text-gray-400 hover:text-white'}`}
          >
            List Equipment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Browse Machinery Section */}
        {activeTab === 'browse' ? (
          <>
            {/* Filter Panel */}
            <aside className="lg:col-span-3 space-y-6">
              <div className="bg-[#1F2937] p-6 rounded-3xl border border-white/5 shadow-2xl space-y-6">
                <h3 className="text-sm font-bold text-green-500 uppercase tracking-widest flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4" /> Filter Listings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                      <input 
                        type="text" 
                        value={filters.location}
                        onChange={(e) => setFilters({...filters, location: e.target.value})}
                        className="w-full bg-[#111827] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="State or District..."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Equipment Type</label>
                    <select 
                      value={filters.type}
                      onChange={(e) => setFilters({...filters, type: e.target.value as EquipmentType})}
                      className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">All Types</option>
                      <option value="Tractor">Tractor</option>
                      <option value="Harvester">Harvester</option>
                      <option value="Seeder">Seeder</option>
                      <option value="Sprayer">Sprayer</option>
                      <option value="Rotavator">Rotavator</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Land Size (Acres)</label>
                    <input 
                      type="number" 
                      value={filters.acres}
                      onChange={(e) => setFilters({...filters, acres: Number(e.target.value)})}
                      className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Duration</label>
                    <select 
                      value={filters.duration}
                      onChange={(e) => setFilters({...filters, duration: e.target.value})}
                      className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="1 Day">1 Day</option>
                      <option value="3 Days">3 Days</option>
                      <option value="1 Week">1 Week</option>
                      <option value="Per Hour">Per Hour</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* AI Insight Card (Contextual) */}
              {aiAdvice && (
                <div className="bg-[#1a241b] p-6 rounded-3xl border border-green-500/20 shadow-2xl space-y-4 slide-up">
                  <h3 className="text-sm font-bold text-green-500 uppercase tracking-widest flex items-center gap-2">
                    <Zap className="w-4 h-4" /> AI Recommendation
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed italic">"{aiAdvice}"</p>
                </div>
              )}
            </aside>

            {/* Listings Grid */}
            <div className="lg:col-span-9 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredListings.length > 0 ? (
                  filteredListings.map(listing => (
                    <div key={listing.id} className="bg-[#1F2937] p-6 rounded-3xl border border-white/5 hover:border-green-500/30 transition-all group hover:scale-[1.02] shadow-xl relative overflow-hidden flex flex-col h-full">
                      <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                        <Truck size={80} />
                      </div>
                      
                      <div className="flex items-start justify-between mb-4 relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
                          <Truck className="w-6 h-6 text-green-500" />
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#111827] rounded-full border border-white/5">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span className="text-[10px] font-bold text-white">{listing.rating}</span>
                        </div>
                      </div>

                      <div className="flex-grow space-y-2 mb-6">
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{listing.type}</div>
                        <h3 className="text-xl font-bold text-white">{listing.model}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <MapPin className="w-3 h-3" /> {listing.location} ({listing.distance} km away)
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <User className="w-3 h-3" /> Owned by {listing.owner}
                        </div>
                        <div className="inline-flex mt-2 items-center gap-2 px-3 py-1 bg-green-900/20 rounded-lg text-[10px] font-bold text-green-500 border border-green-500/10">
                          {listing.status}
                        </div>
                      </div>

                      <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                        <div className="text-2xl font-black text-white">₹{listing.cost}<span className="text-xs text-gray-500 font-medium"> / {filters.duration.includes('Hour') ? 'hr' : 'day'}</span></div>
                        <div className="flex gap-2">
                           <button 
                            onClick={() => runAiAnalysis(listing)}
                            disabled={isAiLoading}
                            className="p-3 bg-white/5 border border-white/10 rounded-xl text-green-500 hover:bg-white/10 transition-all disabled:opacity-50"
                            title="Analyze Cost Effectiveness"
                           >
                            {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                           </button>
                           <button className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold shadow-xl transition-all text-sm">
                            Book Now
                           </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full p-20 bg-[#111827] border border-dashed border-white/10 rounded-3xl text-center flex flex-col items-center">
                    <Truck size={64} className="text-gray-800 mb-6" />
                    <h3 className="text-xl font-bold text-gray-500">No machinery found matching your criteria.</h3>
                    <p className="text-gray-600 mt-2">Try adjusting your filters or search in a wider location.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          /* List Equipment Section */
          <div className="lg:col-span-8 lg:col-start-3 bg-[#1F2937] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-10 animate-fade-in">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center border border-green-500/20">
                <Plus className="w-8 h-8 text-green-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Register Your Machinery</h2>
                <p className="text-gray-400">Help your community and earn income from idle equipment.</p>
              </div>
            </div>

            <form onSubmit={handleListSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Equipment Category</label>
                  <select 
                    value={newListing.type}
                    onChange={(e) => setNewListing({...newListing, type: e.target.value as EquipmentType})}
                    className="w-full bg-[#111827] border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:ring-2 focus:ring-green-500 font-semibold"
                  >
                    <option value="Tractor">Tractor</option>
                    <option value="Harvester">Harvester</option>
                    <option value="Seeder">Seeder</option>
                    <option value="Sprayer">Sprayer</option>
                    <option value="Rotavator">Rotavator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Model Name & Year</label>
                  <input 
                    type="text" 
                    required
                    value={newListing.model}
                    onChange={(e) => setNewListing({...newListing, model: e.target.value})}
                    className="w-full bg-[#111827] border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:ring-2 focus:ring-green-500 font-semibold"
                    placeholder="e.g. Mahindra 575 DI (2022)"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Rental Cost (₹)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input 
                      type="number" 
                      required
                      value={newListing.cost || ''}
                      onChange={(e) => setNewListing({...newListing, cost: Number(e.target.value)})}
                      className="w-full bg-[#111827] border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-white outline-none focus:ring-2 focus:ring-green-500 font-semibold"
                      placeholder="Amount per day"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Operating Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input 
                      type="text" 
                      required
                      value={newListing.location}
                      onChange={(e) => setNewListing({...newListing, location: e.target.value})}
                      className="w-full bg-[#111827] border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-white outline-none focus:ring-2 focus:ring-green-500 font-semibold"
                      placeholder="e.g. Pune, Maharashtra"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Availability Dates</label>
                  <div className="relative">
                    <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input 
                      type="text" 
                      required
                      value={newListing.availability}
                      onChange={(e) => setNewListing({...newListing, availability: e.target.value})}
                      className="w-full bg-[#111827] border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-white outline-none focus:ring-2 focus:ring-green-500 font-semibold"
                      placeholder="e.g. Aug 1 - Aug 15"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Contact Number</label>
                  <input 
                    type="tel" 
                    required
                    value={newListing.contact}
                    onChange={(e) => setNewListing({...newListing, contact: e.target.value})}
                    className="w-full bg-[#111827] border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:ring-2 focus:ring-green-500 font-semibold"
                    placeholder="10-digit mobile number"
                  />
                </div>
              </div>

              <div className="md:col-span-2 pt-4">
                 <button 
                  type="submit"
                  className="w-full py-5 bg-gradient-to-r from-green-700 to-green-500 text-white rounded-[2rem] font-black text-xl hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-green-900/40 flex items-center justify-center gap-4"
                >
                  Confirm Registration <CheckCircle2 className="w-6 h-6" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Footer / Shared Economy Section */}
      <section className="bg-gradient-to-br from-[#111827] to-[#1F2937] p-10 lg:p-14 rounded-[2.5rem] border border-white/5 shadow-2xl mt-12 overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/5 blur-[120px] pointer-events-none transition-all group-hover:bg-green-500/10"></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl font-bold text-white font-serif">Empowering Shared Rural Economy</h2>
            <p className="text-lg text-gray-400 leading-relaxed">
              Shared access to modern farm machinery significantly reduces the capital burden on small-scale farmers. 
              By utilizing a rental marketplace, we increase regional productivity, ensure faster harvest cycles, 
              and promote community collaboration for a sustainable agricultural future.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-1" />
                <span className="text-sm text-gray-300">Decrease individual machinery debt.</span>
              </div>
              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-1" />
                <span className="text-sm text-gray-300">Maximize ROI on idle equipment.</span>
              </div>
              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-1" />
                <span className="text-sm text-gray-300">Access to high-tech implements.</span>
              </div>
              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-1" />
                <span className="text-sm text-gray-300">Reduce manual labor dependency.</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-64 h-64 lg:w-80 lg:h-80 bg-green-500/10 rounded-full border border-green-500/20 flex items-center justify-center p-12">
               <Truck size={150} className="text-green-500/40" />
               <div className="absolute inset-0 border-[10px] border-green-500/5 rounded-full border-t-green-500/40 animate-spin-slow"></div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default MachineryExchange;
