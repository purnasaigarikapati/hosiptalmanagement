import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  FileCheck2, 
  HelpCircle, 
  ShieldAlert, 
  ArrowRight,
  Info,
  CornerDownLeft
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';

export const FloatingCopilot: React.FC = () => {
  const { 
    chatMessages, 
    isCopilotLoading, 
    sendMessage, 
    t 
  } = useHealth();

  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    t.promptLab,
    t.promptRx,
    t.promptDoctor,
    'Are my cholesterol levels within normal range?'
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isCopilotLoading) return;
    setInput('');
    await sendMessage(text);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isCopilotLoading]);

  return (
    <div 
      id="copilot-section"
      className="glass-panel-glow rounded-3xl p-5 sm:p-6 border border-cyan-400/35 shadow-glow-cyan flex flex-col h-[650px] relative overflow-hidden"
    >
      {/* Background radial gradient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Copilot Header */}
      <div className="pb-4 border-b border-cyan-500/20 relative z-10">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500/30 to-blue-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  {t.copilotHeading}
                </h3>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              </div>
              <p className="text-xs text-slate-400">
                {t.copilotSubheading}
              </p>
            </div>
          </div>
        </div>

        {/* Demo Mode Badge */}
        <div className="mt-3 flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px]">
          <span className="flex items-center gap-1.5 text-cyan-300 font-mono">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            {t.demoModeActive}
          </span>
          <span className="text-slate-400 font-mono text-[10px]">7 Records Synced</span>
        </div>
      </div>

      {/* Chat Messages Feed */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 text-xs sm:text-sm">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md rounded-tr-sm'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-sm shadow-inner'
              }`}
            >
              <div className="whitespace-pre-line">
                {msg.text}
              </div>

              {/* Cited Medical Records */}
              {msg.citedRecords && msg.citedRecords.length > 0 && (
                <div className="pt-2 mt-2 border-t border-slate-800/80 text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1 font-mono uppercase tracking-wider text-[10px] mb-1">
                    <FileCheck2 className="w-3 h-3 text-teal-400" /> Cited Records:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {msg.citedRecords.map((cite, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/50 font-mono text-[10px]"
                      >
                        {cite}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Follow-up suggestions */}
              {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                <div className="pt-2 mt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                  {msg.suggestedFollowUps.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(prompt)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white border border-slate-700 text-[11px] transition text-left flex items-center gap-1 group"
                    >
                      <span>{prompt}</span>
                      <ArrowRight className="w-3 h-3 text-cyan-400 group-hover:translate-x-0.5 transition" />
                    </button>
                  ))}
                </div>
              )}

              <div className="text-[10px] text-right opacity-60 font-mono pt-0.5">
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {isCopilotLoading && (
          <div className="flex gap-3 items-center text-xs text-cyan-300 p-3 rounded-2xl bg-slate-900/60 border border-slate-800 w-fit">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>Analyzing clinical records & generating response...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Prompts Shelf */}
      <div className="pt-2 pb-2 border-t border-slate-800/80">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 block">
          Suggested Prompts:
        </span>
        <div className="flex gap-1.5 overflow-x-auto pb-1.5 no-scrollbar">
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-cyan-950/40 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 text-[11px] whitespace-nowrap transition duration-150"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Input & Controls */}
      <div className="pt-2 relative z-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 bg-slate-900/95 border border-cyan-500/30 rounded-2xl p-1.5 focus-within:border-cyan-400 focus-within:shadow-[0_0_15px_rgba(0,242,254,0.25)] transition duration-200"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.copilotPlaceholder}
            className="flex-1 bg-transparent px-3 py-1.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={!input.trim() || isCopilotLoading}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
          >
            <span className="hidden sm:inline">Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Medical disclaimer note */}
        <p className="text-[10px] text-slate-400 text-center mt-2 flex items-center justify-center gap-1">
          <ShieldAlert className="w-3 h-3 text-cyan-400/80 shrink-0" />
          <span>{t.disclaimerCopilot}</span>
        </p>
      </div>

    </div>
  );
};
