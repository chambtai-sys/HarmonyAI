import React, { useState } from 'react';
import { Image as ImageIcon, Sparkles, AlertCircle, Key, Download } from 'lucide-react';
import { generateMusicImage } from '../services/geminiService';
import { ImageSize } from '../types';

const ImageGenTool: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<ImageSize>(ImageSize.SIZE_1K);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [keyRequired, setKeyRequired] = useState(false);

  const checkKeyAndGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError('');
    setKeyRequired(false);

    try {
      // 1. Check if key is selected
      const hasKey = await (window as any).aistudio?.hasSelectedApiKey();
      
      if (!hasKey) {
        setLoading(false);
        setKeyRequired(true);
        return;
      }

      // 2. Generate Image
      const url = await generateMusicImage(prompt, size);
      setImageUrl(url);

    } catch (err: any) {
      if (err.message && err.message.includes('Requested entity was not found')) {
        // Handle race condition/invalid key state
        setKeyRequired(true);
        setError('Session expired or invalid key. Please select a key again.');
      } else {
        setError(err.message || "Failed to generate image.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectKey = async () => {
    try {
      await (window as any).aistudio?.openSelectKey();
      // Assume success as per instructions and immediately try to generate or let user click generate again.
      // We will hide the modal and let user click "Generate" again to be safe and simple, 
      // or we could auto-trigger. Let's just hide the warning and let them click generate.
      setKeyRequired(false);
    } catch (err) {
      console.error("Key selection failed", err);
      setError("Failed to open key selector.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
       <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
          Visualize Music Art
        </h2>
        <p className="text-slate-400 max-w-lg mx-auto">
          Create stunning, high-fidelity visualizations of musical concepts using the Nano Banana Pro (Gemini 3 Pro Image) model.
        </p>
      </div>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 shadow-xl">
        <form onSubmit={checkKeyAndGenerate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Art Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A surreal oil painting of a C Major scale floating in space, golden musical notes, ethereal atmosphere..."
              className="w-full h-32 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
               <label className="block text-sm font-medium text-slate-300 mb-2">Resolution</label>
               <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
                  {Object.values(ImageSize).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                        size === s ? 'bg-pink-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
               </div>
            </div>
          </div>

          {keyRequired && (
            <div className="bg-yellow-900/20 border border-yellow-700/50 p-4 rounded-xl flex flex-col md:flex-row items-center gap-4 justify-between animate-pulse">
               <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-yellow-500" />
                  <div className="text-sm text-yellow-200">
                    <p className="font-semibold">Paid API Key Required</p>
                    <p className="opacity-80">High-resolution image generation requires a specific paid project key.</p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                 <a 
                   href="https://ai.google.dev/gemini-api/docs/billing" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="text-xs text-yellow-400 hover:underline whitespace-nowrap"
                 >
                   Billing Docs
                 </a>
                 <button
                    type="button"
                    onClick={handleSelectKey}
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white text-sm font-bold rounded-lg transition-colors whitespace-nowrap"
                 >
                    Select Key
                 </button>
               </div>
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading || !prompt}
            className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-pink-900/20"
          >
            {loading ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                Generating Art...
              </>
            ) : (
              <>
                <ImageIcon className="w-5 h-5" />
                Generate Image
              </>
            )}
          </button>
        </form>

        {error && (
            <div className="mt-6 p-4 bg-red-900/20 border border-red-800 rounded-lg flex items-center gap-3 text-red-200">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
            </div>
        )}
      </div>

      {imageUrl && (
        <div className="animate-slide-up bg-slate-800 rounded-2xl border border-slate-700 p-2 shadow-2xl">
          <div className="relative group">
              <img src={imageUrl} alt="Generated Art" className="w-full rounded-xl" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                  <a href={imageUrl} download="harmony-ai-art.png" className="px-6 py-3 bg-white text-slate-900 rounded-full font-bold flex items-center gap-2 hover:bg-slate-200 transition-colors">
                      <Download className="w-5 h-5" />
                      Download
                  </a>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGenTool;