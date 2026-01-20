
import React, { useState, useRef, useEffect } from 'react';
import { askClippyStream } from '../services/gemini';
import { Send, User, Cpu, Sparkles } from 'lucide-react';
import { GenerateContentResponse } from '@google/genai';

export const AIChatApp: React.FC = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: 'Sistem hatasız başlatıldı. Ben XPFuture Clippy. Geleceği birlikte inşa etmeye hazır mısınız?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);
    setStreamingText('');

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      
      const stream = await askClippyStream(userMsg, history);
      let fullResponse = '';

      for await (const chunk of stream) {
        const text = (chunk as GenerateContentResponse).text;
        if (text) {
          fullResponse += text;
          setStreamingText(fullResponse);
        }
      }
      
      setMessages(prev => [...prev, { role: 'model', text: fullResponse }]);
      setStreamingText('');
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'model', text: 'Bağlantı hatası: Kuantum tünelleme başarısız oldu.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0f1e] text-blue-50">
      {/* Status Bar */}
      <div className="bg-blue-900/30 px-4 py-1 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
          <span className="text-[10px] uppercase font-orbitron tracking-tighter text-blue-300">Neural Link: Connected</span>
        </div>
        <Sparkles size={12} className="text-cyan-400" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-blue-800">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`max-w-[85%] flex items-start gap-3 p-4 rounded-2xl relative shadow-xl ${
              m.role === 'user' 
              ? 'bg-gradient-to-br from-blue-700 to-indigo-800 border border-blue-400/30 rounded-tr-none' 
              : 'bg-slate-800/80 backdrop-blur-md border border-slate-600/50 rounded-tl-none'
            }`}>
              {m.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-lg border border-blue-400">
                  <Cpu size={16} className="text-cyan-200" />
                </div>
              )}
              <div className="text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {m.text}
              </div>
              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0 shadow-lg border border-slate-500">
                  <User size={16} className="text-white" />
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Streaming Placeholder */}
        {streamingText && (
          <div className="flex justify-start animate-in fade-in">
            <div className="max-w-[85%] flex items-start gap-3 p-4 rounded-2xl bg-slate-800/80 backdrop-blur-md border border-slate-600/50 rounded-tl-none shadow-xl">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 animate-pulse">
                <Cpu size={16} className="text-cyan-200" />
              </div>
              <div className="text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {streamingText}
                <span className="inline-block w-2 h-4 bg-cyan-500 ml-1 animate-pulse" />
              </div>
            </div>
          </div>
        )}
        
        {isLoading && !streamingText && (
          <div className="flex justify-start">
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.1s]" />
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.2s]" />
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-black/40 border-t border-white/10">
        <div className="relative flex items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Bir mesaj yazın..."
            className="w-full bg-slate-900/80 border border-slate-700 rounded-full pl-5 pr-14 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-500"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-2 bg-blue-600 rounded-full hover:bg-blue-500 disabled:opacity-30 disabled:hover:bg-blue-600 transition-all active:scale-90 shadow-lg"
          >
            <Send size={18} className="text-white" />
          </button>
        </div>
        <div className="mt-2 text-[9px] text-center text-slate-500 uppercase tracking-widest font-orbitron">
          Powered by Gemini 3 Pro Neural Core
        </div>
      </div>
    </div>
  );
};
