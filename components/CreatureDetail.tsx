import React, { useState, useEffect, useRef } from 'react';
import { Creature, ChatMessage } from '../types';
import { createChatSession, sendMessageToGeralt } from '../services/geminiService';
import { SYSTEM_PROMPT_GERALT_NOTES } from '../constants';

interface CreatureDetailProps {
  creature: Creature;
  onBack: () => void;
}

export const CreatureDetail: React.FC<CreatureDetailProps> = ({ creature, onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat specifically for this creature
    const systemPrompt = `${SYSTEM_PROMPT_GERALT_NOTES}\n\nТекущая запись, которую вы обсуждаете: ${creature.name}. Класс: ${creature.className}. Слабости: ${creature.weaknesses.join(', ')}. Описание из книги: ${creature.description}`;
    chatSessionRef.current = createChatSession(systemPrompt);
    
    // Initial message from Geralt
    setMessages([{
      id: 'init',
      role: 'model',
      text: `Заинтересовал ${creature.name.toLowerCase()}? Спрашивай, пока я добрый. У меня есть пара историй про эту тварь.`
    }]);
  }, [creature]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGeralt(chatSessionRef.current, input);
      const modelMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText };
      setMessages(prev => [...prev, modelMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-2 md:p-8 max-w-7xl mx-auto animate-fade-in">
      <button 
        onClick={onBack}
        className="mb-6 flex items-center text-[#a1887f] hover:text-[#d7ccc8] font-headers font-bold text-lg transition-colors group px-4"
      >
        <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">←</span> Закрыть книгу
      </button>

      {/* Book Container */}
      <div className="flex flex-col xl:flex-row gap-0 xl:gap-0 shadow-[0_0_50px_rgba(0,0,0,0.6)] rounded-lg overflow-hidden relative">
        
        {/* Central Spine (only visible on large screens) */}
        <div className="hidden xl:block absolute left-1/2 top-0 bottom-0 w-12 bg-[#2a1c15] z-10 transform -translate-x-1/2 shadow-inner border-x border-[#1a120b]" style={{background: 'linear-gradient(to right, #1a120b, #3e2723 40%, #3e2723 60%, #1a120b)'}}></div>

        {/* Left Page: Main Info */}
        <div className="flex-1 bg-[#f3e5ab] paper-texture p-8 md:p-12 min-h-[600px] border-r border-[#d7ccc8] xl:border-r-0 relative">
           {/* Page fold shadow */}
           <div className="absolute top-0 right-0 bottom-0 w-16 bg-gradient-to-l from-[rgba(0,0,0,0.1)] to-transparent pointer-events-none hidden xl:block"></div>

           <div className="border-4 border-double border-[#3e2723] p-1 inline-block mb-6 shadow-md bg-[#fff8e1] rotate-[-1deg]">
             <div className="w-full h-64 md:h-80 overflow-hidden sepia contrast-125">
                <img src={creature.imageUrl} alt={creature.name} className="w-full h-full object-cover" />
             </div>
           </div>
           
           <h1 className="text-5xl md:text-6xl font-headers font-black text-[#2b1d19] mb-4 ink-text tracking-tight">
             {creature.name}
           </h1>
           <div className="flex items-center gap-4 mb-6">
             <span className="font-handwritten text-2xl text-[#5d4037] border-b border-[#8d6e63]">Класс: {creature.className}</span>
             <div className="flex text-xl text-[#8a0a0a]">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < creature.threatLevel ? 'opacity-100' : 'opacity-20'}>💀</span>
                ))}
             </div>
           </div>
           
           <div className="prose prose-xl ink-text font-serif leading-relaxed text-justify mb-8 first-letter:text-5xl first-letter:float-left first-letter:mr-2 first-letter:font-headers first-letter:text-[#8a0a0a]">
             {creature.description}
           </div>

           <div className="bg-[#fffde7] p-4 rounded border border-[#d7ccc8] shadow-sm relative overflow-hidden">
             <div className="absolute -right-4 -top-4 text-6xl text-[#f9fbe7] opacity-50 select-none">⚔</div>
             <h3 className="text-xl font-headers font-bold text-[#8a0a0a] mb-2 relative z-10 border-b border-[#e65100] inline-block pb-1">Уязвимости:</h3>
             <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 font-serif text-lg text-[#3e2723] relative z-10 list-inside list-[square]">
               {creature.weaknesses.map(w => <li key={w} className="marker:text-[#8a0a0a]">{w}</li>)}
             </ul>
           </div>
        </div>

        {/* Right Page: Geralt's Notes */}
        <div className="flex-1 bg-[#fcf5e5] paper-texture-dark p-8 md:p-12 relative flex flex-col min-h-[600px]">
           {/* Page fold shadow */}
           <div className="absolute top-0 left-0 bottom-0 w-16 bg-gradient-to-r from-[rgba(0,0,0,0.15)] to-transparent pointer-events-none hidden xl:block"></div>

          <h2 className="text-3xl font-handwritten font-bold text-[#3e2723] mb-6 text-center ink-text transform -rotate-1 opacity-80">
            ~ Заметки на полях ~
          </h2>

          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto mb-6 pr-4 space-y-6 font-handwritten text-xl md:text-2xl"
          >
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.role === 'model' && (
                  <span className="text-sm font-headers font-bold text-[#8a0a0a] mb-1 ml-2 opacity-70">Геральт:</span>
                )}
                {msg.role === 'user' && (
                  <span className="text-sm font-headers font-bold text-[#5d4037] mb-1 mr-2 opacity-70">Ученик:</span>
                )}
                
                <div className={`max-w-[90%] p-2 relative ${
                  msg.role === 'user' 
                    ? 'text-[#4e342e] border-r-2 border-[#a1887f] pr-4 text-right' 
                    : 'text-[#2b1d19] ink-text pl-4 border-l-2 border-[#8a0a0a]'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center text-[#8d6e63] italic pl-4">
                <span className="animate-pulse mr-2">✒️</span> Геральт пишет...
              </div>
            )}
          </div>

          <div className="mt-auto relative z-20">
            <div className="absolute -top-3 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#8d6e63] to-transparent opacity-50"></div>
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Спроси совета..."
                className="flex-1 bg-transparent border-b-2 border-[#d7ccc8] focus:border-[#5d4037] outline-none px-2 py-2 font-handwritten text-2xl text-[#3e2723] placeholder-[#a1887f] resize-none h-14"
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-[#3e2723] text-[#f3e5ab] hover:bg-[#5d4037] transition-all transform hover:scale-105 shadow-lg border-2 border-[#1a120b]"
              >
                <span className="text-xl">➤</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};