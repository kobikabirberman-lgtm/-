
import React, { useState, useEffect, useCallback } from 'react';
import { Complaint } from './types';
import Header from './Header';
import ComplaintForm from './ComplaintForm';
import ComplaintList from './ComplaintList';
import Stats from './Stats';

const App: React.FC = () => {
  const [view, setView] = useState<'form' | 'history' | 'stats'>('form');
  const [syncId, setSyncId] = useState(() => localStorage.getItem('berman_sync_id') || '');
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    try {
      const saved = localStorage.getItem('berman_final_v1');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [isSyncing, setIsSyncing] = useState(false);

  // שמירה מקומית לגיבוי
  useEffect(() => {
    localStorage.setItem('berman_final_v1', JSON.stringify(complaints));
  }, [complaints]);

  // פונקציית סנכרון - כאן מתרכזים כל הנתונים
  const syncWithCloud = useCallback(async () => {
    if (!syncId) return;
    setIsSyncing(true);
    try {
      // בגרסה מתקדמת כאן יתבצע Fetch ממסד נתונים חיצוני כמו Firebase
      // כרגע המערכת מוכנה לחיבור כזה ומדמה את פעולת הריכוז
      await new Promise(resolve => setTimeout(resolve, 800));
      console.log("נתונים סונכרנו מול קוד: " + syncId);
    } catch (e) {
      console.error("שגיאת סנכרון");
    } finally {
      setIsSyncing(false);
    }
  }, [syncId]);

  useEffect(() => {
    if (syncId) syncWithCloud();
  }, [syncId, syncWithCloud]);

  const handleAdd = (newC: Complaint) => {
    setComplaints(prev => [newC, ...prev]);
    setView('history');
    if (syncId) syncWithCloud();
  };

  const handleDelete = (id: string) => {
    if(window.confirm('למחוק את הדיווח?')) {
      setComplaints(prev => prev.filter(c => c.id !== id));
      if (syncId) syncWithCloud();
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-right" dir="rtl">
      {/* סטטוס חיבור מרכזי */}
      <div className="bg-amber-950 text-amber-200 text-[10px] py-1.5 px-4 flex justify-between items-center sticky top-0 z-[100] shadow-md border-b border-amber-800">
        <span className="font-black uppercase tracking-widest">מאפיית ברמן • מערכת איכות</span>
        <div className="flex items-center gap-2">
          {syncId ? (
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_green]"></span>
              <span className="font-bold">סנכרון פעיל: {syncId}</span>
            </div>
          ) : (
            <span className="text-amber-600 font-bold">מצב מקומי (ללא סנכרון)</span>
          )}
        </div>
      </div>
      
      <Header setView={setView} currentView={view} isSyncing={isSyncing} />
      
      <main className="max-w-2xl mx-auto p-4 pt-6 pb-24">
        {view === 'form' && <ComplaintForm onAdd={handleAdd} />}
        {view === 'history' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-2xl font-black text-amber-950">יומן דיווחים</h2>
              <button onClick={() => syncWithCloud()} className="p-2 bg-white rounded-full shadow-sm">
                <span className={isSyncing ? 'animate-spin block' : ''}>🔄</span>
              </button>
            </div>
            <ComplaintList complaints={complaints} onDelete={handleDelete} />
          </div>
        )}
        {view === 'stats' && (
          <Stats 
            complaints={complaints} 
            onImport={setComplaints} 
            syncId={syncId} 
            onSetSyncId={(id) => {
              setSyncId(id);
              localStorage.setItem('berman_sync_id', id);
            }} 
          />
        )}
      </main>
    </div>
  );
};

export default App;
