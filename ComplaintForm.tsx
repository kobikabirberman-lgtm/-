ס
import React, { useState, useRef } from 'react';
import { Complaint, Urgency } from '../types';
import { analyzeComplaint } from '../services/geminiService';

interface ComplaintFormProps {
  onAdd: (complaint: Complaint) => void;
}

// פונקציית דחיסה חיונית: מקטינה תמונה מ-10MB ל-0.2MB לפני השליחה
const compressImage = (base64Str: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_SIDE = 800; 
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > MAX_SIDE) { height *= MAX_SIDE / width; width = MAX_SIDE; }
      } else {
        if (height > MAX_SIDE) { width *= MAX_SIDE / height; height = MAX_SIDE; }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.6)); // דחיסה ל-60% איכות
    };
  });
};

const ComplaintForm: React.FC<ComplaintFormProps> = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    productName: '',
    productCode: '',
    description: '',
    targetEmail: 'quality@berman.co.il',
    reporterEmail: '',
    image: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [submittedComplaint, setSubmittedComplaint] = useState<Complaint | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setLoadingStep('מעבד תמונה...');

    try {
      let finalImage = formData.image;
      if (formData.image) {
        finalImage = await compressImage(formData.image);
      }

      setLoadingStep('מנתח נתונים ב-AI...');
      const analysis = await analyzeComplaint(formData.description, formData.productName, finalImage);
      
      const newComplaint: Complaint = {
        id: Date.now().toString(),
        ...formData,
        image: finalImage,
        date: new Date().toLocaleDateString('he-IL'),
        status: 'נשלח',
        aiAnalysis: analysis
      };

      onAdd(newComplaint);
      setSubmittedComplaint(newComplaint);
    } catch (error: any) {
      console.error(error);
      alert('שגיאה: ' + (error.message || 'תקלת תקשורת'));
    } finally {
      setIsSubmitting(false);
      setLoadingStep('');
    }
  };

  if (submittedComplaint) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl p-8 border-t-8 border-green-500 text-center animate-in zoom-in">
        <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg text-3xl">✓</div>
        <h2 className="text-2xl font-black text-slate-900 mb-4">הדיווח נשלח!</h2>
        <div className="space-y-4">
          <button 
            onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`דיווח איכות ברמן:\nמוצר: ${submittedComplaint.productName}\nתיאור: ${submittedComplaint.description}\n\nסיכום AI: ${submittedComplaint.aiAnalysis?.summary}`)}`)}
            className="w-full bg-[#25D366] text-white py-4 rounded-xl font-bold shadow-lg"
          >
            שתף בוואטסאפ למנהל
          </button>
          <button onClick={() => { setSubmittedComplaint(null); setFormData({ ...formData, productName: '', description: '', image: '' }); }} className="w-full bg-slate-100 py-4 rounded-xl font-bold">דיווח חדש +</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-amber-100 relative">
      {isSubmitting && (
        <div className="absolute inset-0 bg-white/90 z-10 flex flex-col items-center justify-center rounded-2xl">
          <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="font-black text-amber-900 text-lg">{loadingStep}</p>
          <p className="text-xs text-amber-600">זה לוקח כ-5 שניות...</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-black text-amber-800 mb-1 mr-1">שם המוצר</label>
          <input required placeholder="למשל: לחם פרוס" className="w-full p-4 rounded-xl bg-amber-50/30 border-2 border-amber-50 outline-none focus:border-amber-500 font-bold" value={formData.productName} onChange={e => setFormData({...formData, productName: e.target.value})} />
        </div>
        
        <div>
          <label className="block text-xs font-black text-amber-800 mb-1 mr-1">תיאור הבעיה</label>
          <textarea required rows={3} placeholder="מה קרה למוצר?" className="w-full p-4 rounded-xl bg-amber-50/30 border-2 border-amber-50 outline-none focus:border-amber-500 font-bold resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
        </div>
        
        <div onClick={() => fileInputRef.current?.click()} className="aspect-video border-4 border-dashed border-amber-100 rounded-2xl flex flex-col items-center justify-center cursor-pointer bg-amber-50/10 overflow-hidden relative">
          {formData.image ? (
            <>
              <img src={formData.image} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-white font-bold opacity-0 hover:opacity-100 transition-opacity">החלף תמונה</div>
            </>
          ) : (
            <div className="text-center text-amber-800">
              <span className="text-4xl block mb-2">📷</span>
              <p className="font-bold">לחץ לצילום המוצר</p>
              <p className="text-[10px] opacity-60">חובה לצרף תמונה לבדיקת איכות</p>
            </div>
          )}
          <input type="file" hidden ref={fileInputRef} accept="image/*" capture="environment" onChange={e => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = () => setFormData({...formData, image: reader.result as string});
              reader.readAsDataURL(file);
            }
          }} />
        </div>

        <button type="submit" disabled={isSubmitting || !formData.image || !formData.productName} className="w-full py-5 bg-amber-700 text-white rounded-2xl font-black text-xl shadow-lg active:scale-95 transition-all disabled:opacity-50">
          שלח לבדיקה
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;
