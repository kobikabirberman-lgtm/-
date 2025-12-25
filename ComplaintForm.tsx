
import React, { useState, useRef } from 'react';
import { Complaint } from './types';
import { analyzeComplaint } from './geminiService';

interface ComplaintFormProps {
  onAdd: (complaint: Complaint) => void;
}

const ComplaintForm: React.FC<ComplaintFormProps> = ({ onAdd }) => {
  const [formData, setFormData] = useState({ productName: '', productCode: '', description: '', image: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productName || !formData.image) return alert('נא למלא שם מוצר ולצרף תמונה');
    
    setIsSubmitting(true);
    try {
      const aiResult = await analyzeComplaint(formData.description, formData.productName, formData.image);
      const newComplaint: Complaint = {
        id: Date.now().toString(),
        productName: formData.productName,
        productCode: formData.productCode || 'N/A',
        description: formData.description,
        image: formData.image,
        date: new Date().toLocaleString('he-IL'),
        status: 'נשלח',
        aiAnalysis: aiResult || undefined
      };
      onAdd(newComplaint);
      setFormData({ productName: '', productCode: '', description: '', image: '' });
    } catch (err) {
      console.error(err);
      alert('שגיאת AI - הדיווח נשמר ללא ניתוח אוטומטי');
      // נשמור בכל זאת גם אם ה-AI נכשל
      onAdd({
        id: Date.now().toString(),
        productName: formData.productName,
        productCode: formData.productCode || 'N/A',
        description: formData.description,
        image: formData.image,
        date: new Date().toLocaleString('he-IL'),
        status: 'נשלח'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 border border-amber-100 relative overflow-hidden">
      {isSubmitting && (
        <div className="absolute inset-0 bg-white/90 z-50 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-900 rounded-full animate-spin mb-4"></div>
          <p className="font-black text-amber-950">AI מנתח את התמונה...</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-black text-amber-900 mb-1 mr-1">שם המוצר</label>
          <input 
            required
            placeholder="למשל: לחם פרוס, פיתות..."
            className="w-full p-4 rounded-2xl bg-amber-50 border border-amber-100 font-bold outline-none focus:border-amber-500 transition-all"
            value={formData.productName}
            onChange={e => setFormData({...formData, productName: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-amber-900 mb-1 mr-1">תיאור התקלה</label>
          <textarea 
            required
            placeholder="מה לא תקין במוצר?"
            className="w-full p-4 rounded-2xl bg-amber-50 border border-amber-100 font-bold h-24 outline-none focus:border-amber-500 transition-all resize-none"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
        </div>
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="aspect-video bg-amber-50 border-2 border-dashed border-amber-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer overflow-hidden relative active:scale-98 transition-all"
        >
          {formData.image ? (
            <img src={formData.image} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center">
               <span className="text-4xl block mb-2">📸</span>
               <span className="text-xs font-black text-amber-800/40">לחץ לצילום / העלאה</span>
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
        <button 
          type="submit" 
          disabled={isSubmitting || !formData.productName || !formData.image}
          className="w-full py-4 bg-amber-900 text-white rounded-2xl font-black shadow-lg hover:bg-amber-800 disabled:opacity-30 transition-all flex items-center justify-center gap-2"
        >
          🚀 שלח דיווח איכות
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;
