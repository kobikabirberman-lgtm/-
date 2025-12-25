import React from 'react';

interface HeaderProps {
  setView: (view: 'form' | 'history' | 'stats') => void;
  currentView: string;
}

const Header: React.FC<HeaderProps> = ({ setView, currentView }) => {
  return (
    <header className="bg-white shadow-md border-b-2 border-amber-600 sticky top-0 z-40">
      <div className="max-w-2xl mx-auto px-4 py-4 flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-amber-900 p-2 rounded-xl shadow-lg rotate-3">
            <span className="text-xl">🥖</span>
          </div>
          <div>
            <h1 className="text-xl font-black text-amber-950 tracking-tight leading-none">ברמן • ניהול איכות</h1>
            <p className="text-[9px] font-bold text-amber-700 uppercase tracking-widest opacity-60">מערכת דיווח פנימית</p>
          </div>
        </div>

        <nav className="flex w-full gap-1 bg-amber-50 p-1 rounded-xl border border-amber-100">
          {[
            { id: 'form', label: 'דיווח חדש', icon: '📸' },
            { id: 'history', label: 'יומן אירועים', icon: '📁' },
            { id: 'stats', label: 'כלים', icon: '⚙️' }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setView(tab.id as any)}
              className={`flex-1 py-2.5 rounded-lg transition-all font-bold text-[11px] flex flex-col items-center gap-0.5 ${
                currentView === tab.id 
                ? 'bg-amber-900 text-white shadow-md' 
                : 'text-amber-800/60 hover:bg-amber-100'
              }`}
            >
              <span className="text-sm">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
