import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { createChatSession, sendMessageToGeralt } from '../services/geminiService';
import { SYSTEM_PROMPT_GERALT_BOARD } from '../constants';

export const ContractsBoard: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatSessionRef.current = createChatSession(SYSTEM_PROMPT_GERALT_BOARD);
    setMessages([{
      id: 'init',
      role: 'model',
      text: "Подходи, не бойся. Читай, что написано. Ищешь работы или хочешь, чтобы я кого-то убил? Пиши свое объявление."
    }]);
  }, []);

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
    <div className="w-full max-w-6xl mx-auto p-2 md:p-6 animate-fade-in">
      <h2 className="text-5xl md:text-6xl font-handwritten font-bold text-[#f3e5ab] text-center mb-6 drop-shadow-[0_4px_4px_rgba(0,0,0,0.9)]">
        Доска Объявлений
      </h2>
      
      {/* Realistic Wood Board Container */}
      <div className="relative rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-[12px] border-[#3e2723] overflow-hidden bg-[#2d1b15]">
        {/* Wood planks background using repeating gradient */}
        <div className="absolute inset-0 opacity-80" 
             style={{
               backgroundImage: `repeating-linear-gradient(90deg, #3e2723 0, #3e2723 100px, #2d1b15 100px, #2d1b15 102px),
                                 url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.2'/%3E%3C/svg%3E")`
             }}>
        </div>

        <div className="relative z-10 flex flex-col h-[700px]">
           
           {/* Messages Area (Pinned Notes) */}
           <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar">
             {messages.map((msg, index) => (
               <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`
                    relative max-w-[300px] md:max-w-md p-6 shadow-xl transform transition-transform hover:scale-105
                    ${index % 2 === 0 ? 'rotate-2' : '-rotate-1'}
                    ${msg.role === 'user' ? 'bg-[#f3e5ab] text-[#3e2723]' : 'bg-[#e0e0e0] text-[#1a120b]'}
                 `}>
                   {/* Nail Head */}
                   <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-[#1a120b] border border-[#5d4037] shadow-sm z-20"></div>
                   
                   {/* Paper Texture Overlay */}
                   <div className="absolute inset-0 paper-texture opacity-30 pointer-events-none"></div>

                   <p className="font-handwritten text-2xl md:text-3xl leading-none mb-2 opacity-80 border-b border-black/10 pb-2">
                     {msg.role === 'model' ? 'Ведьмаку:' : 'Заказ:'}
                   </p>
                   
                   <p className={`font-handwritten text-xl md:text-2xl leading-tight ${msg.role === 'model' ? 'ink-text' : ''}`}>
                     {msg.text}
                   </p>
                   
                   {msg.role === 'model' && (
                      <div className="mt-4 text-right">
                        <span className="text-red-900 font-bold font-headers text-xs border border-red-900 px-1 rounded transform -rotate-12 inline-block">ГЕРАЛЬТ</span>
                      </div>
                   )}
                 </div>
               </div>
             ))}
             {isLoading && (
               <div className="flex justify-start">
                  <div className="bg-[#fffde7] p-4 rotate-3 shadow-lg max-w-xs">
                    <p className="font-handwritten text-xl text-[#5d4037] animate-pulse">
                      ...кто-то прибивает новую записку...
                    </p>
                  </div>
               </div>
             )}
           </div>

           {/* Input Area (Bottom Plank) */}
           <div className="bg-[#2a1c15] p-4 border-t-4 border-[#1a120b] shadow-[0_-5px_15px_rgba(0,0,0,0.5)]">
             <div className="flex gap-2 max-w-4xl mx-auto bg-[#3e2723] p-2 rounded-lg border border-[#5d4037]">
               <input 
                 type="text" 
                 className="flex-1 bg-[#f3e5ab] paper-texture border-none p-3 font-handwritten text-2xl text-[#2b1d19] focus:outline-none rounded-sm placeholder-[#8d6e63]"
                 placeholder="Написать объявление..."
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleSend()}
               />
               <button 
                 onClick={handleSend}
                 disabled={isLoading}
                 className="bg-[#5d4037] hover:bg-[#8d6e63] text-[#f3e5ab] font-handwritten font-bold text-2xl px-6 py-2 rounded-sm shadow-md transition-colors border border-[#3e2723]"
               >
                 Прибить
               </button>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};