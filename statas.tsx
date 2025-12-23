import React, { useRef, useState } from 'react';
import { Complaint } from './types';
import { analyzeComplaint } from './geminiService';

interface StatsProps {
  complaints: Complaint[];
  onImport: (complaints: Complaint[]) => void;
}

const Stats: React.FC<StatsProps> = ({ complaints, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const testApiKey = async () => {
    setTestStatus('loading');
    try {
      await analyzeComplaint("בדיקת מערכת", "לחם בדיקה");
      setTestStatus('success');
    } catch (err) {
      setTestStatus('error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-amber-100">
        <h3 className="text-xl font-black text-amber-950 mb-4">בדיקת חיבור AI</h3>
        <button 
          onClick={testApiKey}
          disabled={testStatus === 'loading'}
          className={`w-full py-4 rounded-2xl font-black transition-all ${
            testStatus === 'success' ? 'bg-green-600 text-white' :
            testStatus === 'error' ? 'bg-red-600 text-white' :
            'bg-amber-100 text-amber-900 border-2 border-amber-200'
          }`}
        >
          {testStatus === 'loading' ? 'בודק...' : 
           testStatus === 'success' ? 'מחובר! ✅' : 
           testStatus === 'error' ? 'שגיאה במפתח ❌' : 
           'בדוק חיבור ל-Gemini'}
        </button>
      </div>

      <div className="bg-amber-950 text-white p-6 rounded-[2rem] shadow-xl">
        <h3 className="text-lg font-black mb-4">גיבוי ונתונים</h3>
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => {
              const dataStr = JSON.stringify(complaints);
              const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
              const link = document.createElement('a');
              link.setAttribute('href', dataUri);
              link.setAttribute('download', 'Berman_Data.json');
              link.click();
            }}
            className="bg-white/10 py-4 rounded-2xl font-bold"
          >
            📥 הורד גיבוי JSON
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-amber-600 py-4 rounded-2xl font-bold"
          >
            📤 העלה נתונים
          </button>
          <input type="file" hidden ref={fileInputRef} accept=".json" onChange={(e) => {
             const file = e.target.files?.[0];
             if (file) {
               const reader = new FileReader();
               reader.onload = (ev) => {
                 try { onImport(JSON.parse(ev.target?.result as string)); alert('הנתונים מוזגו!'); } catch(e) { alert('קובץ לא תקין'); }
               };
               reader.readAsText(file);
             }
          }} />
        </div>
      </div>
    </div>
  );
};

export default Stats;
