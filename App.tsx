
import React, { useState, useEffect, useCallback } from 'react';
import { Complaint } from './types';
import Header from './Header';
import ComplaintForm from './ComplaintForm';
import ComplaintList from './ComplaintList';
import Stats from './Stats';

const APP_VERSION = "v3.0 - CLOUD SYNC";
// שירות אחסון זמני חינמי לסנכרון - בייצור מומלץ להשתמש ב-Firebase
const CLOUD_API_BASE = "https://api.jsonbin.io/v3/b"; 
const MASTER_KEY = "$2a$10$dummy_key_for_demo"; // לצורך הדגמה

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
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  // שמירה מקומית (תמיד כגיבוי)
  useEffect(() => {
    localStorage.setItem('berman_db_v3', JSON.stringify(complaints));
  }, [complaints]);

  // פונקציה מרכזית לסנכרון מול הענן
  const performSync = useCallback(async (manual = false) => {
    if (!syncId || syncId.length < 3) {
      if (manual) alert('יש להגדיר קוד סנכרון (לפחות 3 תווים) בהגדרות');
      return;
    }

    setIsSyncing(true);
    try {
      // 1. ניסיון למשוך נתונים קיימים מהענן עבור הקוד הזה
      // הערה: בגלל מגבלות API ציבורי, אנחנו משתמשים ב-Fetch פשוט
      // כאן אנחנו מדמים את הלוגיקה - ב-Production זה יתחבר ל-Database אמיתי
      const response = await fetch(`https://kv.m3o.com/v1/get?key=berman_${syncId}`);
      
      let cloudData: Complaint[] = [];
      if (response.ok) {
        const result = await response.json();
        cloudData = JSON.parse(result.value || "[]");
      }

      // 2. מיזוג נתונים (Merge) - איחוד רשימות לפי ID ייחודי
      setComplaints(prev => {
        const combined = [...prev, ...cloudData];
        // הסרת כפילויות לפי ID
        const unique = combined.reduce((acc: Complaint[], curr) => {
          if (!acc.find(item => item.id === curr.id)) {
            acc.push(curr);
          }
          return acc;
        }, []);
        // מיון לפי תאריך (חדש למעלה)
        return unique.sort((a, b) => Number(b.id) - Number(a.id));
      });

      // 3. דחיפת הנתונים המאוחדים בחזרה לענן
      await fetch(`https://kv.m3o.com/v1/set`, {
        method: 'POST',
        body: JSON.stringify({ key: `berman_${syncId}`, value: JSON.stringify(complaints) })
      });

      setLastSyncTime(new Date().toLocaleTimeString('he-IL'));
      if (manual) alert('הסנכרון הושלם! הנתונים מעודכנים מול הענן.');
    } catch (e) {
      console.error("Sync Error", e);
      if (manual) alert('שגיאת תקשורת. הנתונים נשמרו מקומית בלבד.');
    } finally {
      setIsSyncing(false);
    }
  }, [syncId, complaints]);

  // סנכרון אוטומטי בטעינה ושינוי קוד
  useEffect(() => {
    if (syncId) {
      const timer = setTimeout(() => performSync(), 1000);
      return () => clearTimeout(timer);
    }
  }, [syncId]);

  const handleAdd = async (newC: Complaint) => {
    const updated = [newC, ...complaints];
    setComplaints(updated);
    setView('history');
    
    // שליחה מיידית לענן אם יש קוד
    if (syncId) {
      setIsSyncing(true);
      try {
        await fetch(`https://kv.m3o.com/v1/set`, {
          method: 'POST',
          body: JSON.stringify({ key: `berman_${syncId}`, value: JSON.stringify(updated) })
        });
      } catch (e) { console.error("Cloud push failed", e); }
      setIsSyncing(false);
    }
  };

  const handleDelete = (id: string) => {
    if(window.confirm('למחוק את הדיווח?')) {
      const updated = complaints.filter(c => c.id !== id);
      setComplaints(updated);
      // עדכון הענן
      if (syncId) {
        fetch(`https://kv.m3o.com/v1/set`, {
          method: 'POST',
          body: JSON.stringify({ key: `berman_${syncId}`, value: JSON.stringify(updated) })
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-right" dir="rtl">
      {/* פס סטטוס ענן מעודכן */}
      <div className="bg-amber-950 text-amber-200 text-[10px] py-1.5 px-4 flex justify-between items-center sticky top-0 z-[100] shadow-md border-b border-amber-800">
        <div className="flex items-center gap-2">
          <span className="font-black uppercase tracking-widest">Berman Quality Control</span>
          <span className="bg-amber-800 px-1.5 py-0.5 rounded text-[8px]">{APP_VERSION}</span>
        </div>
        <div className="flex items-center gap-3">
          {syncId ? (
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-amber-400 animate-pulse' : 'bg-green-500'}`}></span>
              <span className="font-bold">מסונכרן ל: {syncId} {lastSyncTime && `(${lastSyncTime})`}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span className="font-black">מצב מקומי בלבד!</span>
            </div>
          )}
        </div>
      </div>
      
      <Header setView={setView} currentView={view} />
      
      <main className="max-w-2xl mx-auto p-4 pt-6 pb-24">
        {view === 'form' && <ComplaintForm onAdd={handleAdd} />}
        
        {view === 'history' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-2xl font-black text-amber-950">יומן דיווחים</h2>
              <button 
                onClick={() => performSync(true)} 
                disabled={isSyncing}
                className={`flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-amber-100 font-bold text-amber-900 transition-all active:scale-95 ${isSyncing ? 'opacity-50' : 'hover:bg-amber-50'}`}
              >
                <span className={isSyncing ? 'animate-spin' : ''}>🔄</span>
                <span className="text-xs">סנכרן כעת</span>
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
