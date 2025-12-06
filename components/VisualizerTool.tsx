import React, { useState } from 'react';
import { Search, Loader2, Music, Info } from 'lucide-react';
import PianoVisualizer from './PianoVisualizer';
import { getMusicTheoryData } from '../services/geminiService';
import { MusicTheoryResponse } from '../types';

const VisualizerTool: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<MusicTheoryResponse | null>(null);
  const [error, setError] = useState('');

  const handleVisualize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setData(null);

    try {
      const result = await getMusicTheoryData(query);
      setData(result);
    } catch (err) {
      setError('Could not interpret request. Please try again with a clear scale or chord name.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
          Visualize Harmony
        </h2>
        <p className="text-slate-400 max-w-lg mx-auto">
          Type any scale, chord, or mode (e.g., "C Minor Melodic", "G7#9", "D Dorian") and see it instantly on the keyboard.
        </p>
      </div>

      <form onSubmit={handleVisualize} className="relative max-w-xl mx-auto">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter a scale or chord..."
          className="w-full px-6 py-4 rounded-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg transition-all"
        />
        <button
          type="submit"
          disabled={loading || !query}
          className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full px-6 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-200 text-center">
          {error}
        </div>
      )}

      {data && (
        <div className="space-y-6 animate-slide-up">
           <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 shadow-xl backdrop-blur-sm">
              <div className="flex items-start justify-between mb-6">
                <div>
                   <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                     <Music className="w-6 h-6 text-blue-400" />
                     {data.name}
                   </h3>
                   <p className="text-slate-400 mt-2">{data.description}</p>
                </div>
              </div>
              
              <PianoVisualizer notes={data.notes} />

              {data.intervals && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {data.intervals.map((interval, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-700 rounded-full text-xs font-medium text-slate-300 border border-slate-600">
                      {interval}
                    </span>
                  ))}
                </div>
              )}
           </div>

           <div className="bg-blue-900/10 border border-blue-800/30 p-4 rounded-xl flex gap-3 items-start">
              <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-200">
                Tip: You can ask for complex jazz voicings or exotic scales like "Hirajoshi" or "Whole Tone".
              </p>
           </div>
        </div>
      )}
    </div>
  );
};

export default VisualizerTool;