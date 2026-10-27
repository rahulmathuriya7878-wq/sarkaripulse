import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, User, Bot, RefreshCw } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'Namaste! I am SarkariPulse AI - your government job career advisor. Ask me anything about vacancy qualifications, age limits, syllabus breakdowns, admit cards, or application procedures!',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', text: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const history = newMessages.slice(0, -1).map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          history: history,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Chat failed');

      setMessages((prev) => [...prev, { role: 'assistant', text: data.text }]);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'Sorry, I ran into an issue connecting to the AI server. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-600 rounded-xl">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">SarkariPulse AI Advisor</h3>
              <p className="text-xs text-slate-400">Powered by Gemini 3.8 Flash</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message History */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-slate-50">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-3 text-xs ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed whitespace-pre-line shadow-xs ${
                  m.role === 'user'
                    ? 'bg-slate-900 text-white font-medium rounded-tr-xs'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs font-normal'
                }`}
              >
                {m.text}
              </div>

              {m.role === 'user' && (
                <div className="w-7 h-7 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center font-bold shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start text-xs">
              <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 bg-white text-slate-500 rounded-2xl border border-slate-200">
                SarkariPulse AI is checking official government notifications & updates...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        <div className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px] font-semibold text-slate-600">
          <button
            onClick={() => setInput('What are the age relaxations for OBC candidates in Railways?')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 whitespace-nowrap cursor-pointer"
          >
            Age Relaxation in Railways?
          </button>
          <button
            onClick={() => setInput('Explain SSC CGL Tier 2 paper pattern.')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 whitespace-nowrap cursor-pointer"
          >
            SSC CGL Pattern?
          </button>
          <button
            onClick={() => setInput('Top banking jobs open for fresh B.Tech graduates?')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 whitespace-nowrap cursor-pointer"
          >
            Banking Jobs for B.Tech?
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about job notifications, syllabus, forms..."
            className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
