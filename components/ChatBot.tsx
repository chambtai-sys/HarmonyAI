import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User } from 'lucide-react';
import { sendChatMessage } from '../services/geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hello! I'm your music theory tutor. Ask me anything about harmony, counterpoint, rhythm, or music history." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input;
    setInput('');
    
    // Add user message
    const newMessages: Message[] = [...messages, { role: 'user', text: userMessage }];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      // Prepare history for API
      const history = newMessages.slice(0, -1).map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const response = await sendChatMessage(history, userMessage);
      
      setMessages(prev => [...prev, { role: 'model', text: response || "I couldn't generate a response." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[600px] flex flex-col bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-slate-900 border-b border-slate-700 flex items-center gap-3">
        <div className="p-2 bg-indigo-600 rounded-lg">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
           <h3 className="font-semibold text-white">Music Theory Assistant</h3>
           <p className="text-xs text-slate-400">Powered by Gemini 3.0 Pro</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-800/50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
             <div className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm ${
               msg.role === 'user' 
                 ? 'bg-blue-600 text-white rounded-tr-none' 
                 : 'bg-slate-700 text-slate-200 rounded-tl-none'
             }`}>
                {msg.role === 'model' && (
                    <div className="flex items-center gap-2 mb-1 opacity-50 text-xs font-bold uppercase tracking-wider">
                        <Bot className="w-3 h-3" /> AI
                    </div>
                )}
                <div className="whitespace-pre-wrap leading-relaxed">
                  {msg.text}
                </div>
             </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
             <div className="bg-slate-700 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                <span className="text-xs text-slate-400">Thinking...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-900 border-t border-slate-700">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about circle of fifths, counterpoint rules..."
            className="flex-1 bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl px-5 flex items-center justify-center transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;