import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Bestiary } from './components/Bestiary';
import { Legends } from './components/Legends';
import { ContractsBoard } from './components/ContractsBoard';
import { CreatureDetail } from './components/CreatureDetail';
import { GeraltInfo } from './components/GeraltInfo';
import { ViewState, Creature } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.BESTIARY);
  const [selectedCreature, setSelectedCreature] = useState<Creature | null>(null);

  const handleNavigate = (view: ViewState) => {
    setCurrentView(view);
    if (view !== ViewState.CREATURE_DETAIL) {
      setSelectedCreature(null);
    }
  };

  const handleSelectCreature = (creature: Creature) => {
    setSelectedCreature(creature);
    setCurrentView(ViewState.CREATURE_DETAIL);
  };

  const handleBackToBestiary = () => {
    setSelectedCreature(null);
    setCurrentView(ViewState.BESTIARY);
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewState.BESTIARY:
        return <Bestiary onSelectCreature={handleSelectCreature} />;
      case ViewState.LEGENDS:
        return <Legends />;
      case ViewState.CONTRACTS:
        return <ContractsBoard />;
      case ViewState.GERALT:
        return <GeraltInfo />;
      case ViewState.CREATURE_DETAIL:
        return selectedCreature ? (
          <CreatureDetail creature={selectedCreature} onBack={handleBackToBestiary} />
        ) : (
          <Bestiary onSelectCreature={handleSelectCreature} />
        );
      default:
        return <Bestiary onSelectCreature={handleSelectCreature} />;
    }
  };

  return (
    <div className="min-h-screen pb-12 flex flex-col items-center leather-bg relative">
      {/* Background Layers for Atmosphere */}
      
      {/* 1. Vignette (Dark corners) */}
      <div className="fixed inset-0 pointer-events-none z-0" 
           style={{ background: 'radial-gradient(circle at center, transparent 30%, rgba(10, 5, 2, 0.8) 90%)' }}>
      </div>

      {/* 2. Runes/Symbols Overlay (Subtle) */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
           }}>
      </div>

      {/* 3. Navigation */}
      <Navigation currentView={currentView} onNavigate={handleNavigate} />

      {/* 4. Main Content */}
      <main className="w-full relative z-10 mt-4 md:mt-8 px-2 md:px-6">
        {renderContent()}
      </main>

      {/* 5. Footer */}
      <footer className="w-full text-center py-8 mt-auto text-[#a1887f] font-handwritten text-xl relative z-10">
        <div className="max-w-xs mx-auto border-t border-[#5d4037] pt-4">
           <p>© 1272 Школа Волка</p>
           <p className="text-lg mt-1 opacity-70">Полевой дневник</p>
        </div>
      </footer>
    </div>
  );
};

export default App;