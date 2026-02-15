
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Info } from 'lucide-react';
import { Message } from '../types';
import { getAgriAdvice } from '../services/geminiService';

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello! I am your KrishiSahay Assistant. How can I help you with your crops, soil, or markets today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await getAgriAdvice(userMessage);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: 'I encountered an error. Please try again shortly.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 flex flex-col h-[85vh] bg-[#0f1710]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">KrishiSahay Assistant</h1>
          <p className="text-gray-500 text-sm">Real-time Agricultural Intelligence</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-[#1a241b] px-4 py-1.5 rounded-full text-green-500 text-xs font-bold border border-emerald-900/50">
          <Info className="w-3.5 h-3.5" /> AI EXPERT ACTIVE
        </div>
      </div>

      <div className="flex-grow bg-[#1a241b] border border-emerald-900/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative">
        {/* Background Accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/5 to-transparent pointer-events-none"></div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth relative z-10">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center border ${
                msg.role === 'user' ? 'bg-green-600 text-white border-green-500 shadow-lg shadow-green-900/20' : 'bg-[#0a110a] text-green-500 border-emerald-900/50 shadow-lg'
              }`}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={`max-w-[85%] p-4 rounded-2xl text-sm md:text-base leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-br from-green-700 to-emerald-800 text-white rounded-tr-none' 
                  : 'bg-[#0a110a] text-gray-300 border border-emerald-900/30 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-2xl bg-[#0a110a] border border-emerald-900/50 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-green-500 animate-spin" />
              </div>
              <div className="bg-[#0a110a] p-4 rounded-2xl rounded-tl-none border border-emerald-900/30">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-150"></span>
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-300"></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="p-4 md:p-6 bg-[#0a110a] border-t border-emerald-900/30">
          <form onSubmit={handleSend} className="relative max-w-3xl mx-auto group">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for advice on crops, weather, or prices..."
              className="w-full pl-6 pr-16 py-4 bg-[#1a241b] border border-emerald-900/50 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none shadow-xl transition-all text-white placeholder-gray-500"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-2 p-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:scale-[1.05] disabled:opacity-30 disabled:hover:scale-100 transition-all shadow-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <p className="text-center text-[9px] text-gray-600 mt-4 uppercase font-bold tracking-[0.3em]">
            Sustainable Farming Guidance Powered by AI
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;