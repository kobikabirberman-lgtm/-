
import React, { useState, useRef } from 'react';
import { Complaint } from './types';

interface ComplaintFormProps {
  onAdd: (complaint: Complaint) => void;
}

const ComplaintForm: React.FC<ComplaintFormProps> = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    productName: '',
    productCode: '',
    customerNumber: '',
    description: '',
    image: '',
    reporterName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image || !formData.productName) return alert('חובה למלא שם מוצר ולצרף תמונה');
    
    setIsSubmitting(true);
    
    const newComplaint: Complaint = {
      id: Date.now().toString(),
      productName: formData.productName,
      productCode: formData.productCode || 'N/A',
      customerNumber: formData.customerNumber,
      description: formData.description,
      image: formData.image,
      date: new Date().toLocaleString('he-IL'),
      status: 'נשלח',
      reporterName: formData.reporterName
    };

    setTimeout(() => {
      onAdd(newComplaint);
      setFormData({ productName: '', productCode: '', customerNumber: '', description: '', image: '', reporterName: '' });
      setIsSubmitting(false);
      alert('הדיווח נשמר במערכת!');
    }, 500);
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-xl p-6 border border-amber-100 relative overflow-hidden">
      <h2 className="text-xl font-black text-amber-950 mb-6 flex items-center gap-2">
        <span className="bg-amber-100 p-2 rounded-lg">📝</span>
        דיווח אירוע איכות
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-amber-800 mb-1 mr-1">שם מוצר *</label>
            <input 
              required
              className="w-full p-3 rounded-xl bg-amber-50/50 border border-amber-100 focus:border-amber-600 focus:bg-white transition-all text-sm font-bold"
              value={formData.productName}
              onChange={e => setFormData({...formData, productName: e.target.value})}
              placeholder="למשל: לחם אחיד"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-amber-800 mb-1 mr-1">קוד מוצר</label>
            <input 
              className="w-full p-3 rounded-xl bg-amber-50/50 border border-amber-100 focus:border-amber-600 focus:bg-white transition-all text-sm font-bold"
              value={formData.productCode}
              onChange={e => setFormData({...formData, productCode: e.target.value})}
              placeholder="קוד"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-amber-800 mb-1 mr-1">מספר לקוח</label>
            <input 
              className="w-full p-3 rounded-xl bg-amber-50/50 border border-amber-100 focus:border-amber-600 focus:bg-white transition-all text-sm font-bold"
              value={formData.customerNumber}
              onChange={e => setFormData({...formData, customerNumber: e.target.value})}
              placeholder="אם יש"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-amber-800 mb-1 mr-1">שם המדווח</label>
            <input 
              className="w-full p-3 rounded-xl bg-amber-50/50 border border-amber-100 focus:border-amber-600 focus:bg-white transition-all text-sm font-bold"
              value={formData.reporterName}
              onChange={e => setFormData({...formData, reporterName: e.target.value})}
              placeholder="השם שלך"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-amber-800 mb-1 mr-1">תיאור התקלה *</label>
          <textarea 
            required
            className="w-full p-3 rounded-xl bg-amber-50/50 border border-amber-100 focus:border-amber-600 focus:bg-white transition-all text-sm font-bold h-24 resize-none"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            placeholder="מה קרה למוצר?"
          />
        </div>

        <div 
          onClick={() => fileInputRef.current?.click()}
          className="aspect-video bg-amber-50/30 border-2 border-dashed border-amber-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-amber-100/50 transition-all overflow-hidden"
        >
          {formData.image ? (
            <img src={formData.image} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center">
              <span className="text-4xl mb-2 block">📸</span>
              <p className="text-xs font-black text-amber-900">צילום המוצר (חובה)</p>
            </div>
          )}
          <input 
            type="file" 
            hidden 
            ref={fileInputRef} 
            accept="image/*" 
            capture="environment" 
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = () => setFormData({...formData, image: reader.result as string});
                reader.readAsDataURL(file);
              }
            }} 
          />
        </div>

        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-amber-900 text-white rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all disabled:opacity-50"
        >
          {isSubmitting ? 'שומר דיווח...' : 'שמור ושדר למערכת 🚀'}
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;
