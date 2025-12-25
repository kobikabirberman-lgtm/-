
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
      <div className="bg-amber-900 p-8 rounded-3xl text-amber-50">
        <h3 className="text-xl font-black mb-2">☁️ סנכרון מכשירים</h3>
        <p className="text-[10px] text-amber-200 mb-6">הזן קוד סודי כדי לראות את הנתונים בכל המכשירים שלך.</p>
        <div className="space-y-3">
          <input 
            className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-center font-black tracking-widest outline-none"
            value={tempId}
            onChange={e => setTempId(e.target.value.toUpperCase())}
            placeholder="הזן קוד (למשל: BERMAN-1)"
          />
          <button 
            onClick={() => {
              if (tempId.length < 3) return alert('קוד קצר מדי');
              onSetSyncId(tempId);
              alert('קוד סנכרון עודכן!');
            }}
            className="w-full bg-amber-500 text-amber-950 py-3 rounded-xl font-black shadow-lg"
          >
            חבר מכשירים
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-amber-100 flex justify-between items-center">
        <div>
          <span className="block text-2xl font-black text-amber-900">{complaints.length}</span>
          <span className="text-[10px] font-bold text-amber-600 uppercase">דיווחים ביומן</span>
        </div>
        <button 
          onClick={() => {
            const dataStr = JSON.stringify(complaints, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Berman_Backup.json`;
            link.click();
          }}
          className="p-3 bg-slate-50 border rounded-xl text-xl"
        >
          📥
        </button>
      </div>
    </div>
  );
};

export default Stats;
