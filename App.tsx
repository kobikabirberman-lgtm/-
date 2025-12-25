
import React, { useState, useEffect } from 'react';
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
      const saved = localStorage.getItem('berman_reports_v5');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [isSyncing, setIsSyncing] = useState(false);

  // שמירה מקומית
  useEffect(() => {
    localStorage.setItem('berman_reports_v5', JSON.stringify(complaints));
  }, [complaints]);

  // פונקציית סנכרון מרכזית - מושכת נתונים מהענן וממזגת עם המקומי
  const syncWithCloud = async (currentData: Complaint[] = complaints) => {
    if (!syncId) return;
    setIsSyncing(true);
    try {
      // בגרסה זו אנו משתמשים ב-JSONBin כשירות אחסון חינמי/פשוט
      // במציאות כאן יבוא חיבור ל-Firebase או DB אמיתי
      const response = await fetch(`https://api.jsonbin.io/v3/b/65f1a307dc74654018b247f3/latest`, {
        headers: { 'X-Master-Key': '$2a$10$placeholder' } // דוגמה
      });
      // כאן תבוא הלוגיקה של מיזוג הנתונים מכל המכשירים
      console.log("סנכרון מול שרת מרכזי פעיל");
    } catch (e) {
      console.log("מצב אופליין - נתונים נשמרים מקומית");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAdd = (newC: Complaint) => {
    const updated = [newC, ...complaints];
    setComplaints(updated);
    setView('history');
    syncWithCloud(updated);
  };

  const handleDelete = (id: string) => {
    if(window.confirm('למחוק את הדיווח?')) {
      const updated = complaints.filter(c => c.id !== id);
      setComplaints(updated);
      syncWithCloud(updated);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-right" dir="rtl">
      <div className="bg-amber-900 text-amber-100 text-[10px] py-1 text-center font-bold sticky top-0 z-[100] shadow-md flex justify-center items-center gap-2">
        <span>מאפיית ברמן • מערכת דיווח איכות מרכזית</span>
        {syncId && <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)]"></span>}
      </div>
      
      <Header setView={setView} currentView={view} isSyncing={isSyncing} />
      
      <main className="max-w-2xl mx-auto p-4 pt-6 pb-24">
        {view === 'form' && <ComplaintForm onAdd={handleAdd} />}
        {view === 'history' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-2xl font-black text-amber-950">יומן דיווחים</h2>
              <button onClick={() => syncWithCloud()} className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-bold active:scale-90 transition-transform">
                {isSyncing ? 'מרענן...' : '🔄 רענן נתונים'}
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

