
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2, Volume2, Languages, AlertCircle, Info, Zap, Terminal, HeartPulse } from 'lucide-react';
import { connectLiveAssistant } from '../services/geminiService';
import { LiveServerMessage } from '@google/genai';

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encodeBase64(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const VoiceAssistant = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcripts, setTranscripts] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const inputAudioContext = useRef<AudioContext | null>(null);
  const outputAudioContext = useRef<AudioContext | null>(null);
  const nextStartTime = useRef(0);
  const sources = useRef(new Set<AudioBufferSourceNode>());
  const sessionPromise = useRef<any>(null);
  const transcriptRef = useRef<{ user: string, ai: string }>({ user: '', ai: '' });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcripts]);

  const stopAllAudio = () => {
    sources.current.forEach(source => source.stop());
    sources.current.clear();
    nextStartTime.current = 0;
  };

  const startSession = async () => {
    setIsConnecting(true);
    setError('');
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      inputAudioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      sessionPromise.current = connectLiveAssistant({
        onopen: () => {
          setIsConnecting(false);
          setIsActive(true);
          
          const source = inputAudioContext.current!.createMediaStreamSource(stream);
          const scriptProcessor = inputAudioContext.current!.createScriptProcessor(4096, 1, 1);
          scriptProcessor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const int16 = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) {
              int16[i] = inputData[i] * 32768;
            }
            const base64 = encodeBase64(new Uint8Array(int16.buffer));
            sessionPromise.current.then((session: any) => {
              session.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } });
            });
          };
          source.connect(scriptProcessor);
          scriptProcessor.connect(inputAudioContext.current!.destination);
        },
        onmessage: async (message: LiveServerMessage) => {
          const audioBase64 = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audioBase64 && outputAudioContext.current) {
            setIsProcessing(false);
            nextStartTime.current = Math.max(nextStartTime.current, outputAudioContext.current.currentTime);
            const buffer = await decodeAudioData(decodeBase64(audioBase64), outputAudioContext.current, 24000, 1);
            const source = outputAudioContext.current.createBufferSource();
            source.buffer = buffer;
            source.connect(outputAudioContext.current.destination);
            source.addEventListener('ended', () => sources.current.delete(source));
            source.start(nextStartTime.current);
            nextStartTime.current += buffer.duration;
            sources.current.add(source);
          }

          if (message.serverContent?.inputTranscription) {
            transcriptRef.current.user += message.serverContent.inputTranscription.text;
            setIsProcessing(true);
          }
          if (message.serverContent?.outputTranscription) {
            transcriptRef.current.ai += message.serverContent.outputTranscription.text;
          }

          if (message.serverContent?.turnComplete) {
            const u = transcriptRef.current.user;
            const a = transcriptRef.current.ai;
            if (u || a) {
              setTranscripts(prev => [...prev, 
                ...(u ? [{ role: 'user' as const, text: u }] : []),
                ...(a ? [{ role: 'ai' as const, text: a }] : [])
              ]);
            }
            transcriptRef.current = { user: '', ai: '' };
            setIsProcessing(false);
          }

          if (message.serverContent?.interrupted) {
            stopAllAudio();
          }
        },
        onerror: (e: any) => {
          console.error("Live Error:", e);
          setError("Conversation lost. Please check your signal.");
          endSession();
        },
        onclose: () => {
          endSession();
        }
      });
    } catch (err) {
      console.error(err);
      setError("Please allow microphone access to talk to the assistant.");
      setIsConnecting(false);
    }
  };

  const endSession = () => {
    setIsActive(false);
    setIsConnecting(false);
    setIsProcessing(false);
    stopAllAudio();
    if (inputAudioContext.current) inputAudioContext.current.close();
    if (outputAudioContext.current) outputAudioContext.current.close();
    sessionPromise.current?.then((s: any) => s.close());
    sessionPromise.current = null;
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[85vh] space-y-8 py-10 px-4 animate-fade-in">
      {/* Header & Status */}
      <div className="text-center space-y-6 max-w-2xl relative">
        <div className="inline-flex items-center gap-3 px-5 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-900/20">
          <Languages className="w-4 h-4" /> 
          {isActive ? 'Multilingual Engine Active' : 'Universal Language Sync'}
        </div>
        <h1 className="text-5xl lg:text-7xl font-serif font-bold text-white leading-tight">
          Talk to <span className="text-emerald-500">KrishiSahay</span>
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          The world's first agricultural AI that speaks your language. Mirroring your dialect for natural, effortless field support.
        </p>
      </div>

      <div className="relative flex flex-col items-center justify-center w-full max-w-5xl">
        {/* Main Voice Hub */}
        <div className="relative flex items-center justify-center h-[350px] w-[350px] lg:h-[450px] lg:w-[450px] mb-12">
           {isActive && (
              <>
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping opacity-10"></div>
                <div className="absolute inset-6 bg-emerald-500/10 rounded-full animate-pulse border-2 border-emerald-500/20"></div>
                <div className="absolute inset-12 bg-emerald-500/5 rounded-full border border-emerald-500/10 animate-spin-slow"></div>
                {isProcessing && (
                  <div className="absolute inset-0 border-4 border-emerald-500/40 border-t-transparent rounded-full animate-spin"></div>
                )}
              </>
           )}
           
           <button
            onClick={isActive ? endSession : startSession}
            disabled={isConnecting}
            className={`relative z-10 w-56 h-56 lg:w-64 lg:h-64 rounded-full flex flex-col items-center justify-center transition-all duration-500 shadow-3xl group ${
              isActive 
                ? 'bg-red-600/90 border-4 border-red-400/30 shadow-red-900/50 hover:bg-red-700 hover:scale-105 active:scale-95' 
                : 'bg-gradient-to-br from-emerald-600 to-green-500 border-4 border-white/10 shadow-emerald-900/40 hover:scale-110 active:scale-90'
            } disabled:opacity-50`}
          >
            {isConnecting ? (
              <Loader2 className="w-20 h-20 text-white animate-spin" />
            ) : isActive ? (
              <>
                <div className="flex gap-1 mb-4 h-8 items-end">
                   {[1, 2, 3, 4, 5].map(i => (
                     <div key={i} className={`w-1.5 bg-white rounded-full animate-bounce`} style={{animationDelay: `${i * 0.1}s`, height: `${Math.random() * 100 + 50}%`}}></div>
                   ))}
                </div>
                <MicOff className="w-12 h-12 text-white mb-2" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Stop Connection</span>
              </>
            ) : (
              <>
                <Mic className="w-16 h-16 text-white mb-2 group-hover:animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Start Talking</span>
              </>
            )}
          </button>
        </div>

        {/* Intelligence Context Grid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
           {/* Live Transcript Terminal */}
           <div className="lg:col-span-8 bg-[#111827] rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden flex flex-col h-[450px] group transition-all hover:border-emerald-500/20">
              <div className="px-8 py-5 border-b border-white/5 bg-[#1F2937]/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Terminal className="w-4 h-4 text-emerald-500" />
                  <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Live Neural Transcript</span>
                </div>
                {isActive && (
                  <div className="flex items-center gap-3">
                    <HeartPulse className="w-4 h-4 text-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Low Latency Sync</span>
                  </div>
                )}
              </div>
              
              <div ref={scrollRef} className="flex-grow p-10 overflow-y-auto space-y-8 scrollbar-hide">
                {transcripts.length === 0 && !isActive && (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-10">
                    <Volume2 size={80} className="mb-6" />
                    <p className="font-bold text-xl uppercase tracking-widest">Awaiting Audio Input</p>
                    <p className="text-sm">Talk to get started in any language.</p>
                  </div>
                )}
                
                {transcripts.map((t, i) => (
                  <div key={i} className={`flex gap-5 ${t.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-in`}>
                    <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border ${
                      t.role === 'user' ? 'bg-emerald-600 border-emerald-500' : 'bg-gray-800 border-gray-700'
                    }`}>
                      {t.role === 'user' ? <Mic className="w-4 h-4 text-white" /> : <Zap className="w-4 h-4 text-emerald-500" />}
                    </div>
                    <div className={`max-w-[85%] p-5 rounded-3xl text-base ${
                      t.role === 'user' 
                        ? 'bg-emerald-600/10 text-emerald-100 border border-emerald-500/20 rounded-tr-none' 
                        : 'bg-white/5 text-gray-300 border border-white/5 rounded-tl-none'
                    }`}>
                      <p className="leading-relaxed font-medium">{t.text}</p>
                    </div>
                  </div>
                ))}
                
                {isActive && isProcessing && (
                   <div className="flex items-center gap-4 text-emerald-500/60 font-bold text-xs uppercase tracking-widest animate-pulse">
                      <div className="flex gap-1">
                        <div className="w-1 h-1 bg-current rounded-full"></div>
                        <div className="w-1 h-1 bg-current rounded-full"></div>
                        <div className="w-1 h-1 bg-current rounded-full"></div>
                      </div>
                      Processing Language Patterns
                   </div>
                )}
              </div>
           </div>

           {/* Multilingual Support Sidebar */}
           <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#1F2937] p-8 rounded-[3rem] border border-white/5 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                   <Languages size={100} />
                </div>
                <h3 className="text-xs font-black text-white mb-8 flex items-center gap-3 uppercase tracking-widest relative z-10">
                  <Info className="w-4 h-4 text-emerald-500" /> Supported Dialects
                </h3>
                <div className="grid grid-cols-2 gap-3 relative z-10">
                  {['Hindi', 'Marathi', 'Punjabi', 'Telugu', 'Tamil', 'Kannada', 'Bengali', 'Gujarati'].map((lang) => (
                    <div key={lang} className="px-4 py-3 bg-white/5 rounded-2xl border border-white/5 text-[11px] font-bold text-gray-400 hover:text-white hover:border-emerald-500/30 transition-all cursor-default text-center">
                      {lang}
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-8 border-t border-white/5">
                  <p className="text-xs text-gray-500 leading-relaxed italic">
                    "Say something like 'Kapas ke liye kaunsa khad sahi hai?' and I will answer in the same tone."
                  </p>
                </div>
              </div>
              
              {error && (
                <div className="bg-red-950/20 border border-red-500/30 p-8 rounded-[3rem] text-red-400 flex items-start gap-4 animate-bounce">
                  <AlertCircle className="w-6 h-6 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-widest mb-1">Link Error</h4>
                    <p className="text-xs font-medium leading-relaxed">{error}</p>
                  </div>
                </div>
              )}
           </div>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 25s linear infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default VoiceAssistant;
