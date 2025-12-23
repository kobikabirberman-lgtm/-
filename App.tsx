import React, { useState, useEffect } from 'react';
import { Complaint } from './types';
import Header from './Header';
import ComplaintForm from './ComplaintForm';
import ComplaintList from './ComplaintList';
import Stats from './Stats';

const App: React.FC = () => {
  const [view, setView] = useState<'form' | 'history' | 'stats'>('form');
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem('berman_db_v2.1_final');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('berman_db_v2.1_final', JSON.stringify(complaints));
  }, [complaints]);

  const handleDelete = (id: string) => {
    if(window.confirm('למחוק את הדיווח לצמיתות?')) {
      setComplaints(complaints.filter(c => c.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]" dir="rtl">
      <Header setView={setView} currentView={view} />
      
      <main className="max-w-2xl mx-auto p-5 pt-8 pb-24">
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
            <h2 className="text-2xl font-black text-amber-900 px-2 italic">יומן איכות ({complaints.length})</h2>
            <ComplaintList complaints={complaints} onDelete={handleDelete} />
          </div>
        )}

        {view === 'stats' && (
          <Stats complaints={complaints} onImport={setComplaints} />
        )}
      </main>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-amber-100 p-2 text-center text-[9px] text-amber-900 font-bold z-50">
        מערכת פנימית מאפיית ברמן © גרסה 2.1 מעודכנת
      </div>
    </div>
  );
};

export default App;
