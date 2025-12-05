import React from 'react';
import { LEGENDS } from '../constants';

export const Legends: React.FC = () => {
  return (
    <div className="p-4 md:p-8 w-full max-w-4xl mx-auto animate-fade-in">
      <h2 className="text-4xl md:text-5xl font-headers text-[#f3e5ab] text-center mb-12 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] border-b-2 border-[#8d6e63] pb-4 inline-block w-full">
        Мифы и Легенды Севера
      </h2>
      
      <div className="space-y-12">
        {LEGENDS.map((legend, index) => (
          <div key={legend.id} className="relative group perspective-1000">
            {/* Background Paper */}
            <div className={`absolute inset-0 bg-[#f3e5ab] paper-texture rounded shadow-lg transform transition-transform duration-500 ${
              index % 2 === 0 ? 'rotate-1 group-hover:rotate-0' : '-rotate-1 group-hover:rotate-0'
            }`}></div>
            
            {/* Content Container */}
            <div className="relative bg-[#fff8e1] paper-texture p-6 md:p-8 rounded shadow-[2px_4px_12px_rgba(0,0,0,0.4)] border border-[#d7ccc8] transform transition-all duration-300 hover:-translate-y-1">
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 border-b border-dashed border-[#a1887f] pb-2">
                <h3 className="text-3xl font-headers font-bold text-[#3e2723]">
                  {legend.title}
                </h3>
                <span className="text-sm font-bold uppercase tracking-widest text-[#bf360c] bg-[#eefebe] px-2 py-1 rounded border border-[#a1887f] mt-2 md:mt-0">
                  {legend.region}
                </span>
              </div>
              
              <div className="first-letter:text-5xl first-letter:font-headers first-letter:text-[#5d4037] first-letter:float-left first-letter:mr-3 first-letter:mt-[-10px]">
                <p className="text-xl font-serif leading-relaxed text-[#3e2723] text-justify">
                  {legend.content}
                </p>
              </div>

              {/* Decorative stamp or signature */}
              <div className="mt-6 flex justify-end opacity-70">
                 <div className="w-16 h-16 border-2 border-[#8d6e63] rounded-full flex items-center justify-center transform -rotate-12">
                    <span className="font-headers text-xs text-[#8d6e63] text-center font-bold">Библиотека<br/>Оксенфурта</span>
                 </div>
              </div>

            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-16 text-center">
        <p className="text-[#a1887f] font-handwritten text-2xl italic">
          "Не всякая сказка ложь, но и не каждой стоит верить..."
        </p>
      </div>
    </div>
  );
};