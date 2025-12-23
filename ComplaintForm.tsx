import React, { useState, useRef } from 'react';
import { Complaint } from './types';
import { analyzeComplaint } from './geminiService';

interface ComplaintFormProps {
  onAdd: (complaint: Complaint) => void;
}

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

const ComplaintForm: React.FC<ComplaintFormProps> = ({ onAdd }) => {
  const [formData, setFormData] = useState({ productName: '', description: '', image: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) return alert('חובה לצרף תמונה');
    
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
    } catch (error: any) {
      alert('שגיאת AI: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl p-7 border border-amber-100 relative overflow-hidden">
      {isSubmitting && (
        <div className="absolute inset-0 bg-white/95 z-50 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-800 rounded-full animate-spin mb-4"></div>
          <p className="font-black text-amber-950">AI מנתח את התלונה...</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <input 
          required 
          placeholder="מה שם המוצר?" 
          className="w-full p-4 rounded-2xl bg-amber-50/30 border-2 border-amber-100 font-bold text-lg outline-none focus:border-amber-600" 
          value={formData.productName} 
          onChange={e => setFormData({...formData, productName: e.target.value})} 
        />
        <textarea 
          required 
          placeholder="תאר את התקלה..." 
          className="w-full p-4 rounded-2xl bg-amber-50/30 border-2 border-amber-100 font-bold h-32 outline-none focus:border-amber-600" 
          value={formData.description} 
          onChange={e => setFormData({...formData, description: e.target.value})} 
        />
        <div 
          onClick={() => fileInputRef.current?.click()} 
          className="aspect-video border-4 border-dashed border-amber-200 rounded-3xl flex items-center justify-center bg-amber-50/20 cursor-pointer overflow-hidden relative"
        >
          {formData.image ? (
            <img src={formData.image} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center">
              <span className="text-5xl block mb-2">📸</span>
              <span className="font-black text-amber-900">צלם או בחר תמונה</span>
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
          className="w-full py-5 premium-gradient text-white rounded-2xl font-black text-xl shadow-lg active:scale-95 transition-transform disabled:opacity-50"
        >
          שלח לניתוח איכות
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;
