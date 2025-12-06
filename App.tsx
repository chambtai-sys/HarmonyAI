import React, { useState } from 'react';
import { LayoutDashboard, MessageSquare, Image as ImageIcon } from 'lucide-react';
import VisualizerTool from './components/VisualizerTool';
import ChatBot from './components/ChatBot';
import ImageGenTool from './components/ImageGenTool';
import { AppMode } from './types';

function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.VISUALIZER);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Header / Nav */}
      <nav className="md:hidden bg-slate-800 border-b border-slate-700 p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between mb-4">
           <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">HarmonyAI</h1>
        </div>
        <div className="flex justify-around bg-slate-900 rounded-lg p-1">
            <button 
              onClick={() => setMode(AppMode.VISUALIZER)}
              className={`flex-1 py-2 rounded-md text-sm font-medium ${mode === AppMode.VISUALIZER ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
            >
              Theory
            </button>
            <button 
              onClick={() => setMode(AppMode.CHAT)}
              className={`flex-1 py-2 rounded-md text-sm font-medium ${mode === AppMode.CHAT ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
            >
              Chat
            </button>
            <button 
              onClick={() => setMode(AppMode.IMAGE)}
              className={`flex-1 py-2 rounded-md text-sm font-medium ${mode === AppMode.IMAGE ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
            >
              Art
            </button>
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-800 border-r border-slate-700 p-6 sticky top-0 h-screen">
         <div className="mb-10">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">HarmonyAI</h1>
            <p className="text-xs text-slate-500 mt-2">Music Theory & Visualization</p>
         </div>
         
         <div className="space-y-2 flex-1">
            <SidebarItem 
              active={mode === AppMode.VISUALIZER} 
              onClick={() => setMode(AppMode.VISUALIZER)} 
              icon={<LayoutDashboard className="w-5 h-5" />} 
              label="Theory Visualizer" 
            />
            <SidebarItem 
              active={mode === AppMode.CHAT} 
              onClick={() => setMode(AppMode.CHAT)} 
              icon={<MessageSquare className="w-5 h-5" />} 
              label="AI Tutor" 
            />
            <SidebarItem 
              active={mode === AppMode.IMAGE} 
              onClick={() => setMode(AppMode.IMAGE)} 
              icon={<ImageIcon className="w-5 h-5" />} 
              label="Art Generator" 
            />
         </div>

         <div className="pt-6 border-t border-slate-700">
            <p className="text-xs text-slate-500 text-center">Powered by Google Gemini</p>
         </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto min-h-[calc(100vh-80px)] md:min-h-screen">
         <div className="max-w-5xl mx-auto">
            {mode === AppMode.VISUALIZER && <VisualizerTool />}
            {mode === AppMode.CHAT && <ChatBot />}
            {mode === AppMode.IMAGE && <ImageGenTool />}
         </div>
      </main>
    </div>
  );
}

const SidebarItem: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
        : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

export default App;