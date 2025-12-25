
import React, { useState, useEffect, useCallback } from 'react';
import { Complaint } from './types';
import Header from './Header';
import ComplaintForm from './ComplaintForm';
import ComplaintList from './ComplaintList';
import Stats from './Stats';

const APP_VERSION = "v3.2 - ROOT UNIFIED";

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

  const syncData = useCallback(async (dataToPush?: Complaint[]) => {
    if (!syncId || syncId.length < 3) return;
    
    setIsSyncing(true);
    // שימוש במפתח ייחודי המבוסס על ה-Sync ID של המשתמש
    const key = `berman_bakery_sync_${syncId.toLowerCase()}`;
    const url = `https://api.keyvalue.xyz/7b6a4891/${key}`;

    try {
      const res = await fetch(url);
      let cloudData: Complaint[] = [];
      
      if (res.ok) {
        const cloudText = await res.text();
        cloudData = JSON.parse(cloudText || "[]");
      }

      const currentData = dataToPush || complaints;
      const merged = [...currentData, ...cloudData].reduce((acc: Complaint[], curr) => {
        if (!acc.find(i => i.id === curr.id)) acc.push(curr);
        return acc;
      }, []);
      
      const sorted = merged.sort((a, b) => Number(b.id) - Number(a.id));
      setComplaints(sorted);

      // דחיפה לענן אם יש נתונים חדשים או אם זה סנכרון יזום
      await fetch(url, { 
        method: 'POST', 
        body: JSON.stringify(sorted),
        headers: { 'Content-Type': 'application/json' }
      });

      setLastSync(new Date().toLocaleTimeString('he-IL'));
    } catch (e) {
      console.error("Sync error:", e);
    } finally {
      setIsSyncing(false);
    }
  }, [syncId, complaints]);

  useEffect(() => {
    localStorage.setItem('berman_db_v3', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    if (syncId) {
      const timer = setTimeout(() => syncData(), 500);
      return () => clearTimeout(timer);
    }
  }, [syncId]);

  const handleAdd = (newC: Complaint) => {
    const updated = [newC, ...complaints];
    setComplaints(updated);
    setView('history');
    if (syncId) syncData(updated);
  };

  const handleDelete = (id: string) => {
    if(window.confirm('למחוק את הדיווח?')) {
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
              מחובר: {syncId} {lastSync && `(${lastSync})`}
            </span>
          ) : (
            <span className="text-red-400 font-bold animate-pulse">מצב מקומי (ללא סנכרון)</span>
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
              <button 
                onClick={() => syncData()} 
                disabled={isSyncing}
                className={`p-3 bg-white rounded-2xl shadow-sm border border-amber-100 transition-all active:scale-90 ${isSyncing ? 'opacity-50' : ''}`}
              >
                <span className={`block text-lg ${isSyncing ? 'animate-spin' : ''}`}>🔄</span>
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
