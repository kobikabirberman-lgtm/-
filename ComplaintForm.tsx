
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
    if (!formData.productName || !formData.image) return alert('נא למלא הכל');
    
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
      alert('שגיאה');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 border border-amber-100 relative overflow-hidden">
      {isSubmitting && <div className="absolute inset-0 bg-white/80 z-50 flex items-center justify-center font-black">מעבד AI...</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          required
          placeholder="שם מוצר"
          className="w-full p-4 rounded-xl bg-amber-50 border border-amber-100 font-bold"
          value={formData.productName}
          onChange={e => setFormData({...formData, productName: e.target.value})}
        />
        <textarea 
          required
          placeholder="מה התקלה?"
          className="w-full p-4 rounded-xl bg-amber-50 border border-amber-100 font-bold h-24"
          value={formData.description}
          onChange={e => setFormData({...formData, description: e.target.value})}
        />
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="aspect-video bg-amber-50 border-2 border-dashed border-amber-200 rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden"
        >
          {formData.image ? <img src={formData.image} className="w-full h-full object-cover" /> : <span className="text-4xl">📷</span>}
          <input type="file" hidden ref={fileInputRef} accept="image/*" capture="environment" onChange={e => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = () => setFormData({...formData, image: reader.result as string});
              reader.readAsDataURL(file);
            }
          }} />
        </div>
        <button type="submit" className="w-full py-4 bg-amber-900 text-white rounded-xl font-black shadow-lg">שלח דיווח 🚀</button>
      </form>
    </div>
  );
};

export default ComplaintForm;
