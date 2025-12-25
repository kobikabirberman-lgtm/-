
import React from 'react';

interface HeaderProps {
  setView: (view: 'form' | 'history' | 'stats') => void;
  currentView: string;
}

const Header: React.FC<HeaderProps> = ({ setView, currentView }) => {
  return (
    <header className="bg-white shadow-md border-b-2 border-amber-600 sticky top-8 z-40">
      <div className="max-w-2xl mx-auto px-4 py-4 flex flex-col items-center gap-4">
        <div className="flex items-center gap-4 w-full justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-amber-900 p-2 rounded-xl">
               <span className="text-xl">🍞</span>
            </div>
            <div>
              <h1 className="text-lg font-black text-amber-950">ברמן • ניהול איכות</h1>
            </div>
          </div>
        </div>

        <nav className="flex w-full gap-2 bg-amber-50 p-1 rounded-xl">
          {[
            { id: 'form', label: 'דווח', icon: '📝' },
            { id: 'history', label: 'יומן', icon: '📁' },
            { id: 'stats', label: 'הגדרות', icon: '⚙️' }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setView(tab.id as any)}
              className={`flex-1 py-2 rounded-lg font-black text-[11px] flex items-center justify-center gap-2 ${
                currentView === tab.id ? 'bg-amber-900 text-white' : 'text-amber-800/60'
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
