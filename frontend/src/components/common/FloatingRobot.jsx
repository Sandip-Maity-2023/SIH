import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  RotateCcw,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Mic,
  MicOff,
  ChevronDown,
  Key,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { sendChatMessage } from '../../services/api';

const QUICK_PROMPTS = [
  { icon: '🌾', label: 'How to list produce?', prompt: 'How do I list my crop harvest for sale on Krishi Marketplace?' },
  { icon: '🤝', label: 'FPO Pooling', prompt: 'How does FPO pooling work and what are the benefits for farmers?' },
  { icon: '🚚', label: 'VRP Logistics', prompt: 'How does logistics tracking and VRP route optimization work?' },
  { icon: '🔒', label: 'Escrow Security', prompt: 'How does blockchain escrow protect payments for farmers and buyers?' },
  { icon: '🔬', label: 'AI Quality Grading', prompt: 'How does AI grade crop quality and what are Grade A/B/C standards?' },
];

export default function FloatingRobot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [customKey, setCustomKey] = useState(() => localStorage.getItem('krishi_gemini_key') || '');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isListening, setIsListening] = useState(false);

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "👋 **Hello! I'm KrishiBot**, your smart agricultural assistant powered by Google Gemini.\n\nAsk me anything about **crop listings**, **FPO aggregation**, **live logistics & VRP routing**, **escrow payments**, or **crop care**!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [messages, isOpen, isMinimized]);

  // Handle Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN'; // Indian English / Hinglish friendly

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Voice speech recognition is not supported in this browser.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  // Text-to-Speech helper
  const speakText = (text) => {
    if (!soundEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    // Clean markdown symbols for cleaner speech
    const cleanText = text.replace(/[*#_`>-]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (messageToSend) => {
    const text = (messageToSend || inputMessage).trim();
    if (!text || loading) return;

    const userTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessages = [...messages, { sender: 'user', text, timestamp: userTimestamp }];

    setMessages(newMessages);
    setInputMessage('');
    setLoading(true);

    try {
      const history = newMessages.slice(-6).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await sendChatMessage(text, history, customKey);

      const botReply = res?.reply || "I'm sorry, I couldn't process that. Please try again.";
      const botTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: botReply,
          source: res?.source,
          timestamp: botTimestamp,
        },
      ]);

      speakText(botReply);
    } catch (err) {
      console.error('Chat request error:', err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: "⚠️ **Connection Error**: Unable to connect to Gemini AI service. Please ensure the backend server is running.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setMessages([
      {
        sender: 'bot',
        text: "✨ Conversation cleared! How can I assist you with your crops, orders, or logistics today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSaveCustomKey = (key) => {
    setCustomKey(key);
    if (key.trim()) {
      localStorage.setItem('krishi_gemini_key', key.trim());
    } else {
      localStorage.removeItem('krishi_gemini_key');
    }
    setShowSettings(false);
  };

  // Helper to render basic markdown formatting cleanly
  const renderFormattedText = (rawText) => {
    const lines = rawText.split('\n');
    return lines.map((line, idx) => {
      let trimmed = line.trim();

      // Heading 3 ###
      if (trimmed.startsWith('### ')) {
        return (
          <h4 key={idx} className="font-bold text-emerald-950 dark:text-emerald-300 text-sm mt-2 mb-1">
            {trimmed.replace('### ', '')}
          </h4>
        );
      }
      // Heading 2 ##
      if (trimmed.startsWith('## ')) {
        return (
          <h3 key={idx} className="font-bold text-emerald-900 dark:text-emerald-200 text-sm mt-2 mb-1">
            {trimmed.replace('## ', '')}
          </h3>
        );
      }
      // Bullet list items
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const itemContent = trimmed.replace(/^[-*]\s+/, '');
        return (
          <li key={idx} className="ml-4 list-disc text-xs text-gray-800 dark:text-gray-200 leading-relaxed my-0.5">
            {formatBold(itemContent)}
          </li>
        );
      }
      // Numbered list items
      if (/^\d+\.\s+/.test(trimmed)) {
        return (
          <div key={idx} className="ml-2 text-xs text-gray-800 dark:text-gray-200 leading-relaxed my-0.5">
            {formatBold(trimmed)}
          </div>
        );
      }
      // Empty line spacer
      if (!trimmed) {
        return <div key={idx} className="h-1.5" />;
      }

      return (
        <p key={idx} className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed my-0.5">
          {formatBold(line)}
        </p>
      );
    });
  };

  // Replace **text** with bold span
  const formatBold = (str) => {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-emerald-900 dark:text-emerald-300">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. FLOATING ROBOT TRIGGER BUTTON (Bottom-Right)                            */}
      {/* ========================================================================= */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          {/* Friendly greeting tooltip bubble */}
          <div
            onClick={() => setIsOpen(true)}
            className="cursor-pointer hidden sm:flex items-center gap-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-2 rounded-full shadow-lg border border-emerald-500/30 text-emerald-900 dark:text-emerald-300 text-xs font-semibold hover:border-emerald-500 transition-all transform hover:-translate-x-1"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Ask Krishi AI 🤖</span>
          </div>

          {/* Animated 3D-Style Robot Floating Avatar */}
          <button
            id="floating-robot-trigger"
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            aria-label="Open Krishi AI Assistant"
            className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 shadow-xl shadow-emerald-600/30 hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white/60 focus:outline-none focus:ring-4 focus:ring-emerald-400/40"
          >
            {/* Robot Floating Bobbing Wrapper */}
            <div className="relative animate-bounce [animation-duration:2.5s] flex items-center justify-center">
              {/* Animated Robot SVG */}
              <svg
                className="w-8 h-8 text-white drop-shadow-md transition-transform duration-300 group-hover:rotate-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Antenna */}
                <line x1="12" y1="2" x2="12" y2="5" />
                <circle cx="12" cy="2" r="1" fill="#34d399" />
                {/* Head */}
                <rect x="4" y="5" width="16" height="14" rx="4" fill="currentColor" fillOpacity="0.15" />
                {/* Eyes (Glowing LEDs) */}
                <circle cx="9" cy="11" r="1.5" fill="#a7f3d0" />
                <circle cx="15" cy="11" r="1.5" fill="#a7f3d0" />
                {/* Smile / Voice Grid */}
                <path d="M9 15c.8.7 1.8 1 3 1s2.2-.3 3-1" stroke="#a7f3d0" strokeWidth="1.8" />
                {/* Ears */}
                <line x1="2" y1="12" x2="4" y2="12" />
                <line x1="20" y1="12" x2="22" y2="12" />
              </svg>
            </div>

            {/* Glowing ring pulse */}
            <span className="absolute -inset-1 rounded-full bg-emerald-400 opacity-25 group-hover:opacity-40 animate-pulse pointer-events-none" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CHAT MODAL / DOCKED WIDGET                                              */}
      {/* ========================================================================= */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 w-[380px] sm:w-[420px] max-w-[calc(100vw-24px)] rounded-2xl shadow-2xl bg-white dark:bg-slate-900 border border-emerald-500/20 flex flex-col overflow-hidden transition-all duration-300 backdrop-blur-xl ${
            isMinimized ? 'h-16' : 'h-[580px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white px-4 py-3 flex items-center justify-between shadow-md relative">
            <div className="flex items-center gap-3">
              {/* Mini Robot Avatar */}
              <div className="relative w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
                <Bot className="w-5 h-5 text-emerald-200" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-emerald-800 rounded-full animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm tracking-wide">Krishi AI Assistant</h3>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 font-medium">
                    Gemini
                  </span>
                </div>
                <p className="text-[11px] text-emerald-100/80">Smart India Hackathon Farming Copilot</p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-1">
              {/* Speech Sound Toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? 'Mute Speech' : 'Enable Read-Aloud Voice'}
                className="p-1.5 rounded-lg text-emerald-100 hover:bg-white/20 transition-colors"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-300" /> : <VolumeX className="w-4 h-4 opacity-70" />}
              </button>

              {/* API Key / Settings Button */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                title="AI Configuration & API Key"
                className="p-1.5 rounded-lg text-emerald-100 hover:bg-white/20 transition-colors"
              >
                <Key className="w-4 h-4 opacity-80 hover:opacity-100" />
              </button>

              {/* Clear History */}
              <button
                onClick={handleClearChat}
                title="Restart Conversation"
                className="p-1.5 rounded-lg text-emerald-100 hover:bg-white/20 transition-colors"
              >
                <RotateCcw className="w-4 h-4 opacity-80 hover:opacity-100" />
              </button>

              {/* Minimize / Maximize */}
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand' : 'Minimize'}
                className="p-1.5 rounded-lg text-emerald-100 hover:bg-white/20 transition-colors"
              >
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMinimized ? 'rotate-180' : ''}`} />
              </button>

              {/* Close */}
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-1.5 rounded-lg text-emerald-100 hover:bg-red-500/40 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Collapsible Content */}
          {!isMinimized && (
            <>
              {/* Optional Settings Panel for Custom API Key */}
              {showSettings && (
                <div className="bg-slate-50 dark:bg-slate-800/90 border-b border-gray-200 dark:border-slate-700 p-3 text-xs animate-in fade-in duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Gemini API Key Config
                    </span>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-[11px] mb-2 leading-relaxed">
                    By default, KrishiBot calls your backend's <code className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 px-1 py-0.5 rounded">GEMINI_API_KEY</code>. You can also paste an optional individual key here:
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      placeholder="AIzaSy..."
                      defaultValue={customKey}
                      onBlur={(e) => handleSaveCustomKey(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <button
                      onClick={() => handleSaveCustomKey(customKey)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}

              {/* Chat Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/60 dark:bg-slate-950/40 scrollbar-thin scrollbar-thumb-emerald-300 dark:scrollbar-thumb-slate-700">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`relative max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-sm ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-none'
                          : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 border border-emerald-500/10 dark:border-slate-700 rounded-bl-none'
                      }`}
                    >
                      {/* Bot Header label if applicable */}
                      {msg.sender === 'bot' && (
                        <div className="flex items-center justify-between gap-2 mb-1 pb-1 border-b border-gray-100 dark:border-slate-700/60">
                          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                            <Bot className="w-3 h-3" /> KrishiBot
                          </span>
                          <button
                            onClick={() => handleCopy(msg.text, index)}
                            title="Copy response"
                            className="text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                          >
                            {copiedIndex === index ? (
                              <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      )}

                      {/* Content rendering */}
                      <div className="space-y-1">
                        {renderFormattedText(msg.text)}
                      </div>

                      {/* Timestamp */}
                      <div
                        className={`text-[9px] mt-1.5 flex items-center justify-end gap-1 ${
                          msg.sender === 'user' ? 'text-emerald-100/70' : 'text-gray-400 dark:text-slate-400'
                        }`}
                      >
                        <span>{msg.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {loading && (
                  <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-800 px-3.5 py-2 rounded-2xl rounded-bl-none w-fit border border-emerald-500/20 shadow-sm animate-pulse">
                    <Bot className="w-4 h-4 animate-bounce" />
                    <span className="font-medium text-xs">KrishiBot is thinking with Gemini...</span>
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    </span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions Suggestions */}
              <div className="px-3 py-2 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5">
                {QUICK_PROMPTS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(item.prompt)}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors text-[11px] font-medium shrink-0 disabled:opacity-50"
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Chat Input Section */}
              <div className="p-3 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800">
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl px-3 py-2 border border-gray-200 dark:border-slate-700 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-400/20 transition-all">
                  {/* Voice Input Button */}
                  <button
                    onClick={toggleListening}
                    title={isListening ? 'Stop listening' : 'Speak your question'}
                    className={`p-1 rounded-lg transition-colors ${
                      isListening
                        ? 'text-red-500 animate-pulse bg-red-100 dark:bg-red-900/30'
                        : 'text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400'
                    }`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  {/* Text Input */}
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                    placeholder={isListening ? 'Listening to voice...' : 'Ask about crops, logistics, escrow...'}
                    className="flex-1 bg-transparent text-xs text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none"
                  />

                  {/* Send Button */}
                  <button
                    onClick={() => handleSend()}
                    disabled={!inputMessage.trim() || loading}
                    aria-label="Send query"
                    className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white transition-all disabled:opacity-40 disabled:hover:bg-emerald-600 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-1.5 px-1 text-[10px] text-gray-400 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Krishi Digital AI Assistant
                  </span>
                  <span>Press Enter to send</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
