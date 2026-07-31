import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Zap,
  RotateCcw,
  Minimize2,
  ChevronRight,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  Flame,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { AITool } from '../types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AIConsultantWidgetProps {
  allTools: AITool[];
  onSelectTool: (tool: AITool) => void;
}

const QUICK_PROMPTS = [
  '🚀 What tools do I need for a startup pitch deck?',
  '🎬 How to generate short videos with voiceover?',
  '💻 Best tools for full-stack code generation',
  '🎨 High-res logo & avatar creation tools',
  '🤖 Explain how Autonomous Agents work',
];

export const AIConsultantWidget: React.FC<AIConsultantWidgetProps> = ({
  allTools,
  onSelectTool,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `👋 **Hello! I am your Market1 AI Solution Architect.**

I can analyze your project requirements and recommend the best tools from our marketplace of **800+ AI tools**.

*Describe what you are trying to build, or click one of the quick suggestions below!*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isTyping) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsTyping(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/ai/consultant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          conversationHistory: historyPayload,
        }),
      });

      const data = await res.json();
      const botResponse =
        data.output ||
        'I recommend checking out our flagship **Gemini AI Chat & Assistant** and **Google Veo Video Synth** tools.';

      const botMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Error querying consultant AI:', err);
      const errorMsg: Message = {
        id: `assistant-err-${Date.now()}`,
        role: 'assistant',
        content:
          '⚠️ I encountered a temporary connection issue. You can explore all our tools in the **Marketplace** grid directly!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // Find tools mentioned in assistant text for direct launch buttons
  const findMatchingTools = (text: string): AITool[] => {
    const matches: AITool[] = [];
    const lowerText = text.toLowerCase();

    allTools.forEach((tool) => {
      if (
        lowerText.includes(tool.name.toLowerCase()) ||
        lowerText.includes(tool.id.toLowerCase())
      ) {
        if (!matches.some((m) => m.id === tool.id)) {
          matches.push(tool);
        }
      }
    });

    return matches.slice(0, 3);
  };

  const handleReset = () => {
    setMessages([
      {
        id: `welcome-reset-${Date.now()}`,
        role: 'assistant',
        content: `Conversation reset! Tell me about your new project or goal, and I'll find the perfect AI tools for you.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <>
      {/* FLOATING TRIGGER BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-full shadow-2xl hover:shadow-indigo-500/50 border border-indigo-400/40 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer font-sans"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white animate-bounce" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0D0D12] animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0D0D12]" />
          </div>
          <span className="font-bold text-xs tracking-wide font-mono">AI Consultant</span>
          <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-extrabold uppercase tracking-wider text-amber-200">
            Gemini 3.6
          </span>
        </button>
      )}

      {/* CHAT WINDOW */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md h-[550px] bg-[#0E0E14] border border-indigo-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl animate-fade-in font-sans">
          {/* HEADER */}
          <div className="p-4 bg-gradient-to-r from-slate-950 via-[#12121A] to-indigo-950/90 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shadow-inner">
                <Bot className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
                  Market1 AI Solution Architect
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </h3>
                <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Powered by Gemini API • 800+ Tools Indexed
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Reset Conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Minimize Chat"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* MESSAGES CONTAINER */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#0E0E14] to-[#0B0B0F] scrollbar-thin">
            {messages.map((msg) => {
              const matchedTools =
                msg.role === 'assistant' ? findMatchingTools(msg.content) : [];

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-md ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : 'bg-[#161622] text-slate-200 border border-white/10 rounded-bl-none'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <div className="markdown-body space-y-2 text-xs">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <span>{msg.content}</span>
                    )}

                    {/* MATCHED TOOL CARDS FOR DIRECT LAUNCH */}
                    {matchedTools.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-white/10 space-y-2">
                        <span className="text-[10px] font-mono text-amber-300 font-bold uppercase tracking-wider block">
                          Suggested Market1 Tools:
                        </span>
                        {matchedTools.map((t) => (
                          <div
                            key={t.id}
                            className="bg-[#0D0D12] border border-indigo-500/30 rounded-xl p-2.5 flex items-center justify-between gap-2 hover:border-indigo-400 transition-all"
                          >
                            <div className="overflow-hidden">
                              <h4 className="text-xs font-bold text-white truncate">
                                {t.name}
                              </h4>
                              <p className="text-[10px] text-slate-400 font-mono truncate">
                                {t.category} • {t.credits || 1} Credit
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                onSelectTool(t);
                                setIsOpen(false);
                              }}
                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] rounded-lg shrink-0 flex items-center gap-1 transition-all cursor-pointer shadow"
                            >
                              <span>Launch</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <span
                      className={`text-[9px] font-mono block mt-1.5 text-right ${
                        msg.role === 'user' ? 'text-indigo-200' : 'text-slate-500'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-start gap-2">
                <div className="bg-[#161622] border border-white/10 rounded-2xl p-3 text-xs text-slate-400 flex items-center gap-2">
                  <Bot className="w-4 h-4 text-indigo-400 animate-spin" />
                  <span className="font-mono text-[11px]">Analyzing tools & generating advice...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* QUICK PROMPTS CHIPS */}
          <div className="px-3 py-2 bg-[#09090D] border-t border-white/5 overflow-x-auto flex gap-1.5 scrollbar-none">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                disabled={isTyping}
                className="px-2.5 py-1 bg-white/5 hover:bg-indigo-600/30 text-slate-300 hover:text-indigo-200 text-[10px] font-mono rounded-full border border-white/10 whitespace-nowrap transition-all cursor-pointer shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* INPUT FORM */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[#0D0D12] border-t border-white/10 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Describe your project goal or requirement..."
              disabled={isTyping}
              className="flex-1 px-3 py-2 bg-[#14141C] text-white placeholder-slate-500 text-xs rounded-xl border border-white/10 focus:border-indigo-500 focus:outline-none font-sans"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl transition-all cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
