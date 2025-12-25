
import React, { useState, useEffect } from 'react';
import { Complaint } from './types';
import Header from './Header';
import ComplaintForm from './ComplaintForm';
import ComplaintList from './ComplaintList';
import Stats from './Stats';

const App: React.FC = () => {
  const [view, setView] = useState<'form' | 'history' | 'stats'>('form');
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem('berman_v3.2_final');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('berman_v3.2_final', JSON.stringify(complaints));
  }, [complaints]);

  const handleDelete = (id: string) => {
    if(window.confirm('למחוק את הדיווח?')) {
      setComplaints(complaints.filter(c => c.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]" dir="rtl">
      <div className="bg-amber-800 text-white text-[10px] py-1 text-center font-bold sticky top-0 z-[100] shadow-md uppercase tracking-widest">
        מערכת איכות ברמן • גרסה 3.2 סופית ✅
      </div>
      
      <Header setView={setView} currentView={view} />
      
      <main className="max-w-2xl mx-auto p-5 pt-6 pb-24">
        {view === 'form' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <ComplaintForm onAdd={(newC) => {
               setComplaints([newC, ...complaints]);
               setView('history');
             }} />
          </div>
        )}
        
        {view === 'history' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-2xl font-black text-amber-950 italic">יומן איכות</h2>
              <span className="bg-amber-200 text-amber-900 text-xs px-3 py-1 rounded-full font-bold">
                {complaints.length} דיווחים
              </span>
            </div>
            <ComplaintList complaints={complaints} onDelete={handleDelete} />
          </div>
        )}

        {view === 'stats' && (
          <div className="animate-in fade-in duration-500">
            <Stats complaints={complaints} onImport={setComplaints} />
          </div>
        )}
      </main>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-amber-100 p-2 text-center text-[9px] text-amber-900 font-bold z-40">
        פיתוח פנימי • מאפיית ברמן © 2024
      </div>
    </div>
  );
};

export default App;
