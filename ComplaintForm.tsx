
import React, { useState, useRef } from 'react';
import { Complaint } from './types';
import { analyzeComplaint } from './geminiService';

interface ComplaintFormProps {
  onAdd: (complaint: Complaint) => void;
}

const ComplaintForm: React.FC<ComplaintFormProps> = ({ onAdd }) => {
  const [formData, setFormData] = useState({ productName: '', description: '', image: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        resolve(canvas.toDataURL('image/jpeg', 0.6)); 
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image || !formData.productName) return alert('חובה למלא שם מוצר ותמונה');
    
    setIsSubmitting(true);
    try {
      const compressed = await compressImage(formData.image);
      const analysis = await analyzeComplaint(formData.description, formData.productName, compressed);
      
      onAdd({
        id: Date.now().toString(),
        productName: formData.productName,
        productCode: 'N/A',
        description: formData.description,
        image: compressed,
        date: new Date().toLocaleDateString('he-IL'),
        status: 'נשלח',
        targetEmail: 'quality@berman.co.il',
        reporterEmail: '',
        aiAnalysis: analysis
      });
      
      setFormData({ productName: '', description: '', image: '' });
      alert('דיווח נשלח בהצלחה!');
    } catch (error: any) {
      alert('שגיאה: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl p-6 border border-amber-100 relative">
      {isSubmitting && (
        <div className="absolute inset-0 bg-white/90 z-50 flex flex-col items-center justify-center rounded-[2.5rem] backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-amber-100 border-t-amber-800 rounded-full animate-spin mb-4"></div>
          <p className="font-black text-amber-950 text-sm animate-pulse">AI מנתח את התקלה...</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-black text-amber-800 mb-1 mr-2 uppercase tracking-widest">שם המוצר</label>
          <input 
            required 
            placeholder="איזה מוצר פגום?" 
            className="w-full p-4 rounded-2xl bg-amber-50/30 border border-amber-100 font-bold outline-none focus:border-amber-600 focus:bg-white transition-all shadow-inner" 
            value={formData.productName} 
            onChange={e => setFormData({...formData, productName: e.target.value})} 
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-amber-800 mb-1 mr-2 uppercase tracking-widest">תיאור התקלה</label>
          <textarea 
            required 
            placeholder="מה קרה במוצר?" 
            className="w-full p-4 rounded-2xl bg-amber-50/30 border border-amber-100 font-bold h-24 outline-none focus:border-amber-600 focus:bg-white resize-none transition-all shadow-inner" 
            value={formData.description} 
            onChange={e => setFormData({...formData, description: e.target.value})} 
          />
        </div>

        <div 
          onClick={() => fileInputRef.current?.click()} 
          className="aspect-video border-2 border-dashed border-amber-200 rounded-2xl flex flex-col items-center justify-center bg-amber-50/20 cursor-pointer overflow-hidden relative group active:scale-95 transition-all shadow-inner"
        >
          {formData.image ? (
            <img src={formData.image} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center group-hover:scale-110 transition-transform">
              <span className="text-4xl block mb-2">📸</span>
              <p className="font-black text-amber-900 text-xs">לחץ לצילום התקלה</p>
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
          disabled={isSubmitting || !formData.image} 
          className="w-full py-5 bg-amber-900 text-amber-50 rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all disabled:opacity-30 disabled:grayscale"
        >
          שלח לבדיקת AI
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;
