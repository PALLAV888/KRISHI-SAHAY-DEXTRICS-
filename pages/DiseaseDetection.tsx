
import React, { useState, useRef } from 'react';
import { Camera, Upload, Trash2, ShieldAlert, CheckCircle, AlertTriangle, Loader2, Info, ArrowRight, Zap } from 'lucide-react';
import { detectDisease } from '../services/geminiService';

const DiseaseDetection = () => {
  const [image, setImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) { setError('Invalid file type.'); return; }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setMimeType(file.type);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await detectDisease(image.split(',')[1], mimeType);
      setResult(data);
    } catch (err) { setError('Scanner failed. Try a clearer photo.'); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white font-serif">Crop Disease Scanner</h1>
          <p className="text-gray-400 mt-1">AI-powered visual diagnostics for instant pest and disease identification.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div 
            onClick={() => !image && fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-[2.5rem] transition-all flex flex-col items-center justify-center min-h-[500px] overflow-hidden group cursor-pointer ${
              image ? 'border-green-500/20 bg-[#1F2937]' : 'border-white/10 bg-[#111827] hover:border-green-500/40'
            }`}
          >
            {!image ? (
              <div className="text-center p-12">
                <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/20 group-hover:scale-110 transition-transform duration-500">
                  <Camera className="w-12 h-12 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Upload Sample</h3>
                <p className="text-gray-500 max-w-xs mx-auto">Click or drag a high-resolution photo of the affected area to begin scanning.</p>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>
            ) : (
              <div className="w-full h-full relative group">
                <img src={image} className="w-full h-[500px] object-cover" alt="Scan Specimen" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={(e) => { e.stopPropagation(); setImage(null); setResult(null); }} className="p-5 bg-red-600 rounded-full text-white shadow-2xl hover:bg-red-700 active:scale-95 transition-all">
                    <Trash2 className="w-8 h-8" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!image || isLoading}
            className="w-full py-5 bg-gradient-to-r from-green-700 to-green-500 text-white rounded-2xl font-black text-xl hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-green-900/40 disabled:opacity-30 flex items-center justify-center gap-4"
          >
            {isLoading ? <><Loader2 className="w-7 h-7 animate-spin" /> Analyzing Specimen...</> : <><Zap className="w-7 h-7" /> Run AI Diagnostics</>}
          </button>
        </div>

        <div className="space-y-6">
          {!result && !isLoading && (
            <div className="h-full min-h-[500px] bg-[#111827] border border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-12 shadow-2xl">
              <ShieldAlert size={64} className="text-gray-800 mb-6" />
              <h3 className="text-xl font-bold text-gray-600 mb-2">Awaiting Diagnosis</h3>
              <p className="text-gray-700 text-sm italic">Scan a specimen to view detailed pathology reports.</p>
            </div>
          )}

          {result && (
            <div className="bg-[#1F2937] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl animate-fade-in">
              <div className="p-10 lg:p-14">
                <div className="flex justify-between items-start gap-4 mb-10">
                  <div>
                    <div className="text-[10px] font-bold text-green-500 uppercase tracking-widest mb-2">Pathology Found</div>
                    <h2 className="text-4xl font-black text-white">{result.diseaseName}</h2>
                  </div>
                  <div className={`px-4 py-2 rounded-xl border text-xs font-bold uppercase tracking-widest ${
                    result.severity.toLowerCase() === 'high' ? 'bg-red-950/30 text-red-500 border-red-500/30' : 
                    result.severity.toLowerCase() === 'medium' ? 'bg-amber-950/30 text-amber-500 border-amber-500/30' : 
                    'bg-green-950/30 text-green-500 border-green-500/30'
                  }`}>
                    {result.severity} Risk
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-10">
                  <div className="space-y-6">
                    <h4 className="flex items-center gap-3 text-white font-bold text-sm uppercase tracking-widest border-b border-white/5 pb-4">
                      <AlertTriangle className="w-5 h-5 text-amber-500" /> Treatment Plan
                    </h4>
                    <ul className="space-y-4">
                      {result.treatment.map((t: string, i: number) => (
                        <li key={i} className="flex items-start gap-4 text-gray-300 leading-relaxed group">
                           <div className="mt-1.5 w-2 h-2 rounded-full bg-green-500 group-hover:scale-150 transition-transform shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                           {t}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-6 bg-[#111827] rounded-3xl border border-white/5 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center border border-green-500/20">
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        </div>
                        <span className="text-sm font-bold text-gray-400">Scan Confidence</span>
                     </div>
                     <span className="text-3xl font-black text-green-500">{result.confidence}%</span>
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

export default DiseaseDetection;
