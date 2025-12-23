
import React, { useState, useEffect, useRef } from 'react';
import { Complaint, Urgency } from './types';
import { analyzeComplaint } from './geminiService';

// --- Header Component ---
const Header: React.FC<{ setView: (v: 'form' | 'history' | 'stats') => void, currentView: string }> = ({ setView, currentView }) => (
  <header className="bg-white shadow-md border-b border-amber-100">
    <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between">
      <div className="flex items-center gap-3 mb-4 md:mb-0">
        <div className="bg-amber-600 p-2 rounded-lg shadow-inner text-white">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
        </div>
        <div>
          <h1 className="text-2xl font-black text-amber-900 leading-tight">מאפיית ברמן</h1>
          <p className="text-amber-700 text-xs font-bold tracking-wider uppercase">מערכת דיווח איכות פנימית</p>
        </div>
      </div>
      <nav className="flex items-center gap-1 bg-amber-50 p-1 rounded-xl border border-amber-100">
        {(['form', 'history', 'stats'] as const).map((v) => (
          <button key={v} onClick={() => setView(v)} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${currentView === v ? 'bg-amber-600 text-white shadow-md' : 'text-amber-800 hover:bg-amber-100'}`}>
            {v === 'form' ? 'דיווח חדש' : v === 'history' ? 'היסטוריה' : 'הגדרות'}
          </button>
        ))}
      </nav>
    </div>
  </header>
);

// --- Form Component ---
const ComplaintForm: React.FC<{ onAdd: (c: Complaint) => void }> = ({ onAdd }) => {
  const [formData, setFormData] = useState({ productName: '', productCode: '', description: '', targetEmail: '', reporterEmail: '', image: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState<Complaint | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateBody = (c: Complaint) => `תלונה: ${c.productName}\nתיאור: ${c.description}\nניתוח AI: ${c.aiAnalysis?.summary}\nדחיפות: ${c.aiAnalysis?.urgency}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const analysis = await analyzeComplaint(formData.description, formData.productName, formData.image);
      const newComplaint: Complaint = { id: Date.now().toString(), ...formData, date: new Date().toLocaleDateString('he-IL'), status: 'נשלח', aiAnalysis: analysis };
      onAdd(newComplaint);
      setSubmittedComplaint(newComplaint);
    } catch (error) { console.error(error); } finally { setIsSubmitting(false); }
  };

  if (submittedComplaint) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl p-10 border border-amber-100 text-center max-w-lg mx-auto animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-3xl font-black text-amber-900 mb-2">הדיווח נשמר!</h2>
        <div className="space-y-3 mb-8">
          <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(generateBody(submittedComplaint))}`)} className="w-full bg-[#25D366] text-white py-4 rounded-xl font-bold">שלח בוואטסאפ ✅</button>
          <button onClick={() => window.location.href = `mailto:${submittedComplaint.targetEmail}?subject=תלונה&body=${encodeURIComponent(generateBody(submittedComplaint))}`} className="w-full bg-amber-600 text-white py-4 rounded-xl font-bold">שלח במייל ✉️</button>
        </div>
        <button onClick={() => setSubmittedComplaint(null)} className="text-amber-600 font-bold hover:underline">דיווח נוסף +</button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-amber-100">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <input required placeholder="שם המוצר" className="w-full p-4 rounded-xl border border-amber-200" value={formData.productName} onChange={e => setFormData({...formData, productName: e.target.value})} />
          <input placeholder="קוד מוצר" className="w-full p-4 rounded-xl border border-amber-200" value={formData.productCode} onChange={e => setFormData({...formData, productCode: e.target.value})} />
        </div>
        <textarea required rows={4} placeholder="מה הבעיה במוצר?" className="w-full p-4 rounded-xl border border-amber-200 resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
        <div className="border-2 border-dashed border-amber-200 rounded-xl p-6 text-center cursor-pointer hover:bg-amber-50" onClick={() => fileInputRef.current?.click()}>
          {formData.image ? <img src={formData.image} className="h-32 mx-auto rounded-lg shadow" /> : <p className="text-amber-700 font-bold">📸 צרף תמונה</p>}
          <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={e => {
            const file = e.target.files?.[0];
            if (file) { const reader = new FileReader(); reader.onload = () => setFormData({...formData, image: reader.result as string}); reader.readAsDataURL(file); }
          }} />
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-amber-600 text-white rounded-2xl font-black text-xl shadow-lg disabled:bg-amber-300">
          {isSubmitting ? 'מנתח ב-AI...' : 'שלח דיווח'}
        </button>
      </form>
    </div>
  );
};

// --- List Component ---
const ComplaintList: React.FC<{ complaints: Complaint[] }> = ({ complaints }) => (
  <div className="space-y-4">
    {complaints.length === 0 ? <p className="text-center py-20 text-amber-600 italic">אין תלונות רשומות</p> : 
      complaints.map(c => (
        <div key={c.id} className="bg-white p-5 rounded-2xl shadow border border-amber-100 flex gap-4">
          {c.image && <img src={c.image} className="w-20 h-20 rounded-lg object-cover" />}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-amber-900">{c.productName}</h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${c.aiAnalysis?.urgency === Urgency.CRITICAL ? 'bg-red-500 text-white' : 'bg-amber-100 text-amber-800'}`}>
                {c.aiAnalysis?.urgency || 'בינונית'}
              </span>
            </div>
            <p className="text-sm text-slate-600 line-clamp-1 mt-1">{c.description}</p>
            {c.aiAnalysis && <p className="text-[11px] text-amber-600 bg-amber-50 mt-2 p-2 rounded">"{c.aiAnalysis.summary}"</p>}
          </div>
        </div>
      ))
    }
  </div>
);

// --- Main App ---
const App: React.FC = () => {
  const [view, setView] = useState<'form' | 'history' | 'stats'>('form');
  const [complaints, setComplaints] = useState<Complaint[]>(() => JSON.parse(localStorage.getItem('berman_complaints') || '[]'));
  useEffect(() => localStorage.setItem('berman_complaints', JSON.stringify(complaints)), [complaints]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-10" dir="rtl">
      <Header setView={setView} currentView={view} />
      <main className="max-w-3xl mx-auto px-4 mt-8">
        {view === 'form' && <ComplaintForm onAdd={c => setComplaints([c, ...complaints])} />}
        {view === 'history' && <ComplaintList complaints={complaints} />}
        {view === 'stats' && (
          <div className="bg-white p-10 rounded-2xl shadow-lg border border-amber-100 text-center">
            <h2 className="text-2xl font-bold text-amber-900 mb-6">ניהול נתונים</h2>
            <button onClick={() => {
              const blob = new Blob([JSON.stringify(complaints)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a'); a.href = url; a.download = 'berman_data.json'; a.click();
            }} className="bg-slate-800 text-white px-10 py-4 rounded-xl font-bold shadow-lg">הורד גיבוי (JSON)</button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;

