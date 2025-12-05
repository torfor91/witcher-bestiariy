import React from 'react';
import { ViewState } from '../types';

interface NavigationProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { label: 'Бестиарий', value: ViewState.BESTIARY },
    { label: 'Легенды', value: ViewState.LEGENDS },
    { label: 'Доска Заказов', value: ViewState.CONTRACTS },
    { label: 'О Ведьмаке', value: ViewState.GERALT },
  ];

  return (
    <nav className="w-full flex flex-wrap justify-center gap-2 md:gap-6 py-4 md:py-6 sticky top-0 z-50 bg-[#2a2320]/95 backdrop-blur-sm border-b-2 border-[#5d4037] shadow-lg">
      {navItems.map((item) => (
        <button
          key={item.value}
          onClick={() => onNavigate(item.value)}
          className={`
            px-3 md:px-5 py-2 text-xl md:text-2xl font-handwritten font-bold tracking-wide transition-all duration-300
            transform hover:-translate-y-1 rounded-sm
            ${
              currentView === item.value
                ? 'bg-[#8d6e63] text-[#f3e5ab] shadow-[0_4px_10px_rgba(0,0,0,0.5)] rotate-1 border-2 border-[#f3e5ab]'
                : 'bg-[#3e2723] text-[#a1887f] hover:text-[#f3e5ab] border-2 border-[#5d4037] hover:border-[#8d6e63] -rotate-1'
            }
          `}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
};