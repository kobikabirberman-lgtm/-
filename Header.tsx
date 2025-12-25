
import React from 'react';

interface HeaderProps {
  setView: (view: 'form' | 'history' | 'stats') => void;
  currentView: string;
  isSyncing?: boolean;
}

const Header: React.FC<HeaderProps> = ({ setView, currentView, isSyncing }) => {
  return (
    <header className="bg-white shadow-md border-b-2 border-amber-600 sticky top-10 z-40">
      <div className="max-w-2xl mx-auto px-4 py-4 flex flex-col items-center gap-4">
        <div className="flex items-center gap-4 w-full">
          <div className="bg-amber-900 p-2.5 rounded-2xl shadow-lg rotate-3">
             <span className="text-2xl">🍞</span>
          </div>
          <div>
            <h1 className="text-xl font-black text-amber-950 leading-none">ברמן • ניהול איכות</h1>
            <p className="text-[9px] font-bold text-amber-700 uppercase tracking-widest mt-1 opacity-60">דיווח וריכוז נתונים פנימי</p>
          </div>
        </div>

        <nav className="flex w-full gap-2 bg-amber-50 p-1.5 rounded-2xl border border-amber-100">
          {[
            { id: 'form', label: 'דיווח', icon: '📝' },
            { id: 'history', label: 'יומן', icon: '📁' },
            { id: 'stats', label: 'סנכרון', icon: '⚙️' }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setView(tab.id as any)}
              className={`flex-1 py-3 rounded-xl transition-all font-black text-[11px] flex items-center justify-center gap-2 ${
                currentView === tab.id 
                ? 'bg-amber-900 text-amber-50 shadow-md scale-[1.02]' 
                : 'text-amber-800/60 hover:bg-white'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
