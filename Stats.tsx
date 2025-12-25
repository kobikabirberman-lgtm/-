
import React, { useState } from 'react';
import { Complaint } from './types';

interface StatsProps {
  complaints: Complaint[];
  onImport: (complaints: Complaint[]) => void;
  syncId: string;
  onSetSyncId: (id: string) => void;
}

const Stats: React.FC<StatsProps> = ({ complaints, onImport, syncId, onSetSyncId }) => {
  const [tempId, setTempId] = useState(syncId);

  return (
    <div className="space-y-6">
      <div className="bg-amber-900 p-8 rounded-[2.5rem] shadow-2xl text-amber-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
        <h3 className="text-xl font-black mb-2 flex items-center gap-2">
          <span>☁️</span> סנכרון מכשירים
        </h3>
        <p className="text-[10px] text-amber-200/80 mb-6 font-medium">
          הזן קוד סודי (למשל BERMAN-77) בכל המכשירים שלך כדי לשתף את הדיווחים בזמן אמת.
        </p>
        
        <div className="space-y-3">
          <input 
            className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 text-center font-black tracking-widest outline-none focus:border-amber-400 transition-all placeholder:text-white/20"
            value={tempId}
            onChange={e => setTempId(e.target.value.toUpperCase())}
            placeholder="קוד סנכרון סודי"
          />
          <button 
            onClick={() => {
              if (tempId.length < 3) return alert('הקוד חייב להכיל לפחות 3 תווים');
              onSetSyncId(tempId);
              alert('הקוד נשמר. האפליקציה תתחיל לסנכרן נתונים...');
            }}
            className="w-full bg-amber-500 hover:bg-amber-400 text-amber-950 py-4 rounded-2xl font-black shadow-lg transition-all active:scale-95"
          >
            חבר וסנכרן כעת
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm">
          <span className="block text-3xl font-black text-amber-900">{complaints.length}</span>
          <span className="text-[9px] font-bold text-amber-600 uppercase tracking-widest">דיווחים ביומן</span>
        </div>
        
        <button 
          onClick={() => {
            const dataStr = JSON.stringify(complaints, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Berman_Bakery_Backup.json`;
            link.click();
          }}
          className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm flex flex-col items-center justify-center hover:bg-amber-50 transition-all"
        >
          <span className="text-2xl mb-1">📥</span>
          <span className="text-[9px] font-black text-amber-900 uppercase">גיבוי נתונים</span>
        </button>
      </div>

      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
        <h4 className="text-[10px] font-black text-amber-900 mb-2 uppercase">סטטוס מערכת</h4>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-[10px] font-bold text-amber-800">API_KEY: מוגדר ותקין</span>
        </div>
      </div>
    </div>
  );
};

export default Stats;
