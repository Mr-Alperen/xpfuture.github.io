
import React, { useState } from 'react';
import { generateNeuralArt } from '../services/gemini';
import { Sparkles, Download, Wand2 } from 'lucide-react';

export const ImageGenApp: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    try {
      const result = await generateNeuralArt(prompt);
      setImage(result);
    } catch (e) {
      alert('Neural link failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <div className="flex-1 flex items-center justify-center bg-black/40 rounded-lg border border-white/10 overflow-hidden relative">
        {image ? (
          <img src={image} className="max-h-full max-w-full object-contain" alt="Neural output" />
        ) : (
          <div className="text-center text-slate-500 italic">
            {isLoading ? (
              <div className="flex flex-col items-center gap-2">
                <Sparkles className="w-12 h-12 text-cyan-400 animate-spin" />
                <span>Synthesizing Reality...</span>
              </div>
            ) : 'Enter a prompt to manifest imagery'}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your vision (e.g. A neon skyscraper in the clouds)..."
          className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-sm resize-none focus:outline-none focus:border-cyan-500"
          rows={3}
        />
        <div className="flex gap-2">
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 h-10 rounded font-bold flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
          >
            <Wand2 size={18} />
            GENERATE
          </button>
          {image && (
            <a
              href={image}
              download="neural_art.png"
              className="px-4 bg-slate-800 rounded flex items-center justify-center hover:bg-slate-700 transition-colors"
            >
              <Download size={18} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
