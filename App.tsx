import React, { useState, useEffect } from 'react';
import { Complaint } from './types';
import Header from './Header';
import ComplaintForm from './ComplaintForm';
import ComplaintList from './ComplaintList';
import Stats from './Stats';

const App: React.FC = () => {
  const [view, setView] = useState<'form' | 'history' | 'stats'>('form');
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    try {
      const saved = localStorage.getItem('berman_quality_v4');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('berman_quality_v4', JSON.stringify(complaints));
  }, [complaints]);

  const handleDelete = (id: string) => {
    if(window.confirm('למחוק את הדיווח?')) {
      setComplaints(complaints.filter(c => c.id !== id));
    }
  };

  const handleImport = (newComplaints: Complaint[]) => {
    setComplaints(newComplaints);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]" dir="rtl">
      <div className="bg-amber-900 text-amber-100 text-[10px] py-1 text-center font-bold sticky top-0 z-[100] shadow-md uppercase tracking-widest border-b border-amber-800">
        ברמן • בקרת איכות דיגיטלית ✅
      </div>
      
      <Header setView={setView} currentView={view} />
      
      <main className="max-w-2xl mx-auto p-4 pt-6 pb-24">
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
              <h2 className="text-xl font-black text-amber-950">יומן אירועים</h2>
              <span className="bg-amber-100 text-amber-800 text-[10px] px-3 py-1 rounded-full font-bold">
                {complaints.length} דיווחים
              </span>
            </div>
            <ComplaintList complaints={complaints} onDelete={handleDelete} />
          </div>
        )}

        {view === 'stats' && (
          <div className="animate-in fade-in duration-500">
            <Stats complaints={complaints} onImport={handleImport} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
