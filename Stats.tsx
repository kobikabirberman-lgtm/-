
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
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-amber-900 p-8 rounded-[2.5rem] shadow-2xl text-amber-50 relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl"></div>
        
        <h3 className="text-2xl font-black mb-2 flex items-center gap-3">
          <span className="text-3xl">☁️</span> סנכרון בין מכשירים
        </h3>
        <p className="text-[11px] text-amber-200/80 mb-8 font-medium leading-relaxed">
          רוצה לראות את הדיווחים מהטלפון גם במחשב? <br/>
          בחר קוד סנכרון סודי (למשל: <span className="text-white border-b border-amber-400">BERMAN-HQ</span>) והזן אותו בכל המכשירים שלך.
        </p>
        
        <div className="space-y-4 relative z-10">
          <div className="relative">
            <input 
              className="w-full bg-black/20 border-2 border-white/10 rounded-2xl p-4 pr-12 text-center font-black tracking-widest text-lg outline-none focus:border-amber-400 transition-all placeholder:text-white/20"
              value={tempId}
              onChange={e => setTempId(e.target.value.toUpperCase())}
              placeholder="הזן קוד סודי"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl opacity-50">🔑</span>
          </div>
          
          <button 
            onClick={() => {
              if (tempId.length < 3) return alert('הקוד קצר מדי');
              onSetSyncId(tempId);
            }}
            className="w-full bg-amber-500 hover:bg-amber-400 text-amber-950 py-4 rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            🚀 חבר וסנכרן מכשירים
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2rem] shadow-lg border border-amber-100">
        <h3 className="text-lg font-black text-amber-950 mb-4 flex items-center gap-2">
          <span>📊</span> סטטיסטיקת יומן
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
            <span className="block text-2xl font-black text-amber-900">{complaints.length}</span>
            <span className="text-[9px] font-bold text-amber-600 uppercase">דיווחים סה"כ</span>
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
            className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col items-center justify-center font-black text-[9px] text-slate-600 hover:bg-slate-100 transition-all"
          >
            <span className="text-xl mb-1">📥</span>
            גיבוי לקובץ
          </button>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-[10px] font-bold text-amber-900/30 uppercase tracking-[0.2em]">Berman Bakery Internal System</p>
      </div>
    </div>
  );
};

export default Stats;
