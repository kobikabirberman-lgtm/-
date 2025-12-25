
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

  const handleSave = () => {
    onSetSyncId(tempId);
    alert('קוד סנכרון עודכן! המכשיר מחובר למערכת המרכזית.');
  };

  return (
    <div className="space-y-6">
      <div className="bg-amber-900 p-8 rounded-[2.5rem] shadow-2xl text-amber-50">
        <h3 className="text-2xl font-black mb-4 flex items-center gap-3">
          <span>📡</span> ריכוז נתונים מרכזי
        </h3>
        <p className="text-xs text-amber-200/70 mb-8 font-bold leading-relaxed">
          כדי שכל העובדים ידווחו לאותו המקום, הזינו את אותו "קוד הסנכרון" בכל המכשירים.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase mb-2 mr-1">קוד סנכרון (Sync ID)</label>
            <input 
              className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 text-center font-black tracking-widest text-lg outline-none focus:bg-white/20 transition-all"
              value={tempId}
              onChange={e => setTempId(e.target.value.toUpperCase())}
              placeholder="למשל: BERMAN-CENTER"
            />
          </div>
          <button 
            onClick={handleSave}
            className="w-full bg-amber-500 text-amber-950 py-4 rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all"
          >
            חבר מכשיר זה לענן
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2rem] shadow-lg border border-amber-100">
        <h3 className="text-lg font-black text-amber-950 mb-4">סטטיסטיקה וגיבוי</h3>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-amber-50 p-4 rounded-2xl">
            <span className="block text-2xl font-black text-amber-900">{complaints.length}</span>
            <span className="text-[10px] font-bold text-amber-600 uppercase">דיווחים סה"כ</span>
          </div>
          <button 
            onClick={() => {
              const dataStr = JSON.stringify(complaints, null, 2);
              const blob = new Blob([dataStr], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `Berman_Quality_Backup.json`;
              link.click();
            }}
            className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center justify-center hover:bg-slate-100 transition-colors"
          >
            <span className="text-xl mb-1">💾</span>
            <span className="text-[10px] font-bold text-slate-600 uppercase">ייצוא נתונים</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Stats;
