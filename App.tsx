
import React, { useState, useEffect, useCallback } from 'react';
import { Complaint } from './types';
import Header from './Header';
import ComplaintForm from './ComplaintForm';
import ComplaintList from './ComplaintList';
import Stats from './Stats';

const APP_VERSION = "v3.1 - CLOUD STABLE";

const App: React.FC = () => {
  const [view, setView] = useState<'form' | 'history' | 'stats'>('form');
  const [syncId, setSyncId] = useState(() => localStorage.getItem('berman_sync_id') || '');
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    try {
      const saved = localStorage.getItem('berman_db_v3');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string>('');

  // סנכרון מול שירות KV ציבורי פשוט לצורך הדגמה (מומלץ להחליף ל-Firebase בהמשך)
  const syncData = useCallback(async (dataToPush?: Complaint[]) => {
    if (!syncId || syncId.length < 3) return;
    
    setIsSyncing(true);
    const key = `berman_bakery_${syncId}`;
    const url = `https://api.keyvalue.xyz/7b6a4891/${key}`; // מפתח הדגמה

    try {
      // 1. ניסיון משיכה
      const res = await fetch(url);
      if (res.ok) {
        const cloudText = await res.text();
        const cloudData: Complaint[] = JSON.parse(cloudText || "[]");
        
        // 2. מיזוג נתונים
        setComplaints(prev => {
          const currentData = dataToPush || prev;
          const merged = [...currentData, ...cloudData].reduce((acc: Complaint[], curr) => {
            if (!acc.find(i => i.id === curr.id)) acc.push(curr);
            return acc;
          }, []);
          const sorted = merged.sort((a, b) => Number(b.id) - Number(a.id));
          
          // 3. דחיפה בחזרה לענן (רק אם לא משכנו סתם)
          if (!dataToPush) {
             fetch(url, { method: 'POST', body: JSON.stringify(sorted) }).catch(() => {});
          }
          
          return sorted;
        });
      } else if (dataToPush) {
        // אם המפתח לא קיים בענן, צור אותו
        await fetch(url, { method: 'POST', body: JSON.stringify(dataToPush) });
      }
      setLastSync(new Date().toLocaleTimeString('he-IL'));
    } catch (e) {
      console.error("Sync failed", e);
    } finally {
      setIsSyncing(false);
    }
  }, [syncId]);

  // שמירה מקומית בכל שינוי
  useEffect(() => {
    localStorage.setItem('berman_db_v3', JSON.stringify(complaints));
  }, [complaints]);

  // סנכרון ראשוני
  useEffect(() => {
    if (syncId) syncData();
  }, [syncId, syncData]);

  const handleAdd = (newC: Complaint) => {
    const updated = [newC, ...complaints];
    setComplaints(updated);
    setView('history');
    if (syncId) syncData(updated);
  };

  const handleDelete = (id: string) => {
    if(window.confirm('למחוק?')) {
      const updated = complaints.filter(c => c.id !== id);
      setComplaints(updated);
      if (syncId) syncData(updated);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-right" dir="rtl">
      <div className="bg-amber-950 text-amber-200 text-[10px] py-1.5 px-4 flex justify-between items-center sticky top-0 z-[100] border-b border-amber-800">
        <span className="font-black uppercase tracking-widest">Berman Bakery Quality • {APP_VERSION}</span>
        <div className="flex items-center gap-2">
          {syncId ? (
            <span className="flex items-center gap-1.5 font-bold">
              <span className={`w-1.5 h-1.5 rounded-full ${isSyncing ? 'bg-amber-400 animate-pulse' : 'bg-green-500'}`}></span>
              סנכרון פעיל: {syncId} {lastSync && `(${lastSync})`}
            </span>
          ) : (
            <span className="text-red-400 font-bold animate-pulse">מצב לא מסונכרן</span>
          )}
        </div>
      </div>
      
      <Header setView={setView} currentView={view} />
      
      <main className="max-w-2xl mx-auto p-4 pt-6 pb-24">
        {view === 'form' && <ComplaintForm onAdd={handleAdd} />}
        {view === 'history' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-2xl font-black text-amber-950">יומן איכות</h2>
              <button onClick={() => syncData()} className={`p-2 bg-white rounded-lg shadow-sm border ${isSyncing ? 'opacity-50' : ''}`}>
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
