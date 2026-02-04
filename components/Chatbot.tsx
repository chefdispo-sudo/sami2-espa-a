
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { streamChatResponse } from '../geminiService';

interface ChatbotProps {
  courseTitle: string;
  lessonTitle: string;
  userName: string;
  language: Language;
}

const Chatbot: React.FC<ChatbotProps> = ({ courseTitle, lessonTitle, userName, language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[language].chatbot;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    let assistantText = '';
    setMessages(prev => [...prev, { role: 'model', text: '' }]);

    await streamChatResponse(
      newMessages,
      courseTitle,
      lessonTitle,
      userName,
      language,
      (chunk) => {
        assistantText += chunk;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'model', text: assistantText };
          return updated;
        });
      }
    );

    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
      {/* Fenêtre de Chat */}
      {isOpen && (
        <div className="w-[380px] h-[550px] bg-white/95 dark:bg-slate-900/98 backdrop-blur-3xl rounded-[2.5rem] shadow-3xl border border-indigo-100 dark:border-slate-800 flex flex-col overflow-hidden mb-6 animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header */}
          <div className="p-6 bg-indigo-600 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl shadow-inner">🤖</div>
              <div>
                <h3 className="font-black text-sm uppercase tracking-widest text-white">{t.title}</h3>
                <p className="text-[10px] opacity-90 font-bold uppercase tracking-tighter truncate max-w-[180px] text-indigo-100">Context: {lessonTitle}</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 dark:bg-slate-950">
            {messages.length === 0 && (
              <div className="text-center py-10 space-y-3">
                <span className="text-4xl block animate-bounce">👋</span>
                <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 px-4">{t.welcome}</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-5 py-3 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white font-bold rounded-tr-none shadow-indigo-200 dark:shadow-none' 
                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold rounded-tl-none border border-slate-200 dark:border-slate-700'
                }`}>
                  {msg.text || (
                    <div className="flex gap-1.5 py-2">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="relative">
              <input
                type="text"
                placeholder={t.placeholder}
                className="w-full px-6 py-4 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-600 outline-none text-sm font-bold text-slate-900 dark:text-white pr-14 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 text-indigo-600 disabled:opacity-20 transition-all hover:scale-110 active:scale-90"
              >
                <svg className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bouton FAB */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-3xl transition-all transform hover:scale-110 active:scale-95 z-[110] ${
          isOpen 
            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 rotate-90' 
            : 'bg-indigo-600 text-white'
        }`}
      >
        {isOpen ? (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
        ) : (
          <div className="flex flex-col items-center">
            <span className="text-2xl">🤖</span>
            <span className="text-[7px] font-black uppercase tracking-tighter mt-0.5">Sami</span>
          </div>
        )}
      </button>
    </div>
  );
};

export default Chatbot;
