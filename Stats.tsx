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
    } catch {
      setTestStatus('error');
    }
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(complaints, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Berman_Backup.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-amber-100">
        <h3 className="text-xl font-black text-amber-950 mb-4">סטטוס מערכת AI</h3>
        <button 
          onClick={testApiKey}
          disabled={testStatus === 'loading'}
          className={`w-full py-4 rounded-2xl font-bold transition-all border-2 ${
            testStatus === 'loading' ? 'bg-slate-100 text-slate-400 border-slate-200' :
            testStatus === 'success' ? 'bg-green-600 text-white border-green-700' :
            testStatus === 'error' ? 'bg-red-600 text-white border-red-700' :
            'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
          }`}
        >
          {testStatus === 'loading' ? 'מתחבר לשרת...' : 
           testStatus === 'success' ? 'מחובר! ✅' : 
           testStatus === 'error' ? 'שגיאה במפתח ❌' : 
           'בדוק חיבור ל-Gemini'}
        </button>
      </div>

      <div className="bg-amber-950 text-white p-6 rounded-[2rem] shadow-xl">
        <h3 className="text-lg font-black mb-4 italic text-amber-200">ניהול נתונים</h3>
        <div className="flex flex-col gap-3">
          <button onClick={handleExportJSON} className="bg-white/10 hover:bg-white/20 py-4 rounded-2xl font-bold transition-colors">
            📥 הורד גיבוי מלא (JSON)
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="bg-amber-600 hover:bg-amber-500 py-4 rounded-2xl font-bold transition-colors shadow-lg">
            📤 העלה קובץ נתונים
          </button>
          <input type="file" hidden ref={fileInputRef} accept=".json" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (ev) => {
                try {
                  const data = JSON.parse(ev.target?.result as string);
                  if(Array.isArray(data)) {
                    onImport(data);
                    alert('הנתונים סונכרנו בהצלחה!');
                  }
                } catch(e) { alert('קובץ לא תקין'); }
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
