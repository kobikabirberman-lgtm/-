
import React from 'react';
import { Complaint, Urgency } from './types';

interface ComplaintListProps {
  complaints: Complaint[];
  onDelete: (id: string) => void;
}

const getUrgencyColor = (urgency?: Urgency) => {
  switch (urgency) {
    case Urgency.CRITICAL: return 'bg-red-600 text-white';
    case Urgency.HIGH: return 'bg-orange-500 text-white';
    case Urgency.MEDIUM: return 'bg-amber-500 text-white';
    case Urgency.LOW: return 'bg-green-500 text-white';
    default: return 'bg-gray-400 text-white';
  }
};

const ComplaintList: React.FC<ComplaintListProps> = ({ complaints, onDelete }) => {
  if (complaints.length === 0) return (
    <div className="text-center py-20 opacity-30 flex flex-col items-center">
      <span className="text-6xl mb-4">📜</span>
      <p className="font-black">אין דיווחים ביומן</p>
    </div>
  );

  return (
    <div className="space-y-4">
      {complaints.map(complaint => (
        <div key={complaint.id} className="bg-white rounded-3xl shadow-sm border border-amber-100 flex overflow-hidden hover:shadow-md transition-shadow">
          <div className="w-24 h-24 shrink-0 bg-amber-50">
            <img src={complaint.image} className="w-full h-full object-cover" />
          </div>
          <div className="p-3 flex-1 min-w-0">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-black text-amber-950 truncate text-sm">{complaint.productName}</h3>
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(complaint.id); }} 
                className="text-red-200 hover:text-red-500 p-1"
              >
                🗑️
              </button>
            </div>
            <p className="text-[10px] text-amber-900/70 line-clamp-2 leading-tight mb-2">{complaint.description}</p>
            
            <div className="flex items-center justify-between mt-auto">
              <div className="flex gap-1">
                {complaint.aiAnalysis && (
                  <div className={`px-2 py-0.5 rounded-full text-[8px] font-black ${getUrgencyColor(complaint.aiAnalysis.urgency)}`}>
                    {complaint.aiAnalysis.urgency}
                  </div>
                )}
                <div className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-[8px] font-black">
                  {complaint.status}
                </div>
              </div>
              <div className="text-[8px] text-amber-400 font-bold">{complaint.date}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ComplaintList;
