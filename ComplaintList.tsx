
import React from 'react';
import { Complaint } from './types';

interface ComplaintListProps {
  complaints: Complaint[];
  onDelete: (id: string) => void;
}

const ComplaintList: React.FC<ComplaintListProps> = ({ complaints, onDelete }) => {
  if (complaints.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-amber-100">
        <p className="text-amber-800 font-bold opacity-30 text-lg">אין דיווחים במערכת</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-10">
      {complaints.map(complaint => (
        <div key={complaint.id} className="bg-white rounded-2xl shadow-sm border border-amber-50 overflow-hidden animate-in fade-in duration-300">
          <div className="flex">
            <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 bg-amber-50">
              <img src={complaint.image} className="w-full h-full object-cover" alt="תמונה" />
            </div>
            <div className="p-4 flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-black text-amber-950 text-lg">{complaint.productName}</h3>
                  <div className="flex gap-2 mt-0.5">
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">קוד: {complaint.productCode}</span>
                    {complaint.customerNumber && (
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">לקוח: {complaint.customerNumber}</span>
                    )}
                  </div>
                </div>
                <button onClick={() => onDelete(complaint.id)} className="text-amber-200 hover:text-red-600 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
              <p className="text-xs text-amber-900/80 mt-2 font-medium">
                {complaint.description}
              </p>
              <div className="mt-3 pt-2 border-t border-amber-50 flex justify-between items-center text-[9px] text-amber-500 font-bold uppercase">
                <span>{complaint.date}</span>
                <span>מדווח: {complaint.reporterName || 'אנונימי'}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ComplaintList;
