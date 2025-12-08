import React from 'react';
import { Creature } from '../types';
import { CREATURES } from '../constants';

interface BestiaryProps {
  onSelectCreature: (creature: Creature) => void;
}

// Utility to give random rotation to cards for "messy desk" look
const getRotationClass = (index: number) => {
  const rotations = [
    'rotate-r-1', 'rotate-l-1', 'rotate-r-2', 'rotate-l-2', 
    'rotate-0', 'rotate-r-1', 'rotate-l-3', 'rotate-r-3'
  ];
  return rotations[index % rotations.length];
};

export const Bestiary: React.FC<BestiaryProps> = ({ onSelectCreature }) => {
  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">
      <h2 className="text-4xl md:text-6xl font-headers text-[#e6d5ac] text-center mb-12 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] border-b-2 border-[#8d6e63] pb-4 inline-block w-full">
        Полевой Дневник: Бестиарий
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 md:gap-10 pb-12">
        {CREATURES.map((creature, index) => (
          <div
            key={creature.id}
            onClick={() => onSelectCreature(creature)}
            className={`
              group cursor-pointer relative bg-[#f3e5ab] paper-texture p-4 rounded shadow-[10px_10px_20px_rgba(0,0,0,0.5)] 
              border border-[#8d6e63] transform transition-all duration-300 hover:scale-[1.05] hover:z-10 hover:rotate-0
              ${getRotationClass(index)}
            `}
          >
            {/* Corner decoration */}
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#5d4037] rounded-tr-lg" />
            
            <div className="w-full h-56 overflow-hidden rounded border border-[#a1887f] mb-4 bg-[#2a1c15]">
              <img 
                src={creature.imageUrl} 
                alt={creature.name} 
                loading="lazy"
                className="w-full h-full object-cover sepia-[0.8] brightness-90 contrast-125 group-hover:sepia-0 group-hover:brightness-100 group-hover:contrast-100 transform group-hover:scale-110 transition-all duration-700"
              />
            </div>
            
            <div className="border-b-2 border-[#5d4037] mb-2 pb-1 flex justify-between items-end">
              <h3 className="text-3xl font-headers font-bold text-[#2b1d19] group-hover:text-[#bf360c] transition-colors leading-none">
                {creature.name}
              </h3>
              <span className="text-xl font-handwritten font-bold uppercase tracking-wide text-[#8d6e63]">{creature.className}</span>
            </div>

            <div className="flex items-center space-x-1 mb-3 bg-[rgba(0,0,0,0.05)] p-1 rounded">
               <span className="text-xl font-handwritten font-bold text-[#3e2723] mr-2">Опасность:</span>
               {[...Array(5)].map((_, i) => (
                 <span key={i} className={`text-lg drop-shadow-sm ${i < creature.threatLevel ? 'opacity-100 grayscale-0' : 'opacity-20 grayscale'}`}>
                   💀
                 </span>
               ))}
            </div>
            <p className="text-[#2b1d19] line-clamp-3 text-2xl leading-6 font-handwritten opacity-90 ink-text">
              {creature.description}
            </p>
            <div className="mt-4 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="inline-block px-4 py-1 border-2 border-[#8d6e63] text-[#5d4037] font-handwritten font-bold text-xl uppercase tracking-widest hover:bg-[#3e2723] hover:text-[#f3e5ab] transition-colors rounded-sm">
                Открыть запись
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};  