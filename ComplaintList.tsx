
import React from 'react';
import { Complaint } from './types';

interface ComplaintListProps {
  complaints: Complaint[];
  onDelete: (id: string) => void;
}

const ComplaintList: React.FC<ComplaintListProps> = ({ complaints, onDelete }) => {
  if (complaints.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-amber-100 opacity-50">
        <p className="text-amber-800 font-bold text-lg">אין דיווחים ביומן</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-10">
      {complaints.map(complaint => (
        <div key={complaint.id} className="bg-white rounded-2xl shadow-md border border-amber-50 overflow-hidden animate-in fade-in duration-300">
          <div className="flex">
            <div className="w-28 h-28 sm:w-36 sm:h-36 shrink-0 bg-amber-50">
              <img src={complaint.image} className="w-full h-full object-cover" alt="תמונה" />
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-amber-950 text-lg">{complaint.productName}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">קוד: {complaint.productCode}</span>
                      {complaint.customerNumber && (
                        <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold">לקוח: {complaint.customerNumber}</span>
                      )}
                    </div>
                  </div>
                  <button onClick={() => onDelete(complaint.id)} className="text-amber-200 hover:text-red-600 transition-colors">
                    🗑️
                  </button>
                </div>
                <p className="text-xs text-amber-900/80 mt-3 font-medium leading-relaxed">
                  {complaint.description}
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-amber-50 flex justify-between items-center text-[9px] text-amber-500 font-bold">
                <span>📅 {complaint.date}</span>
                <span>👤 {complaint.reporterName || 'אנונימי'}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ComplaintList;
