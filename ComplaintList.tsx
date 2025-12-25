
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
  if (complaints.length === 0) return <div className="text-center py-20 opacity-50 font-black">אין דיווחים</div>;

  return (
    <div className="space-y-4">
      {complaints.map(complaint => (
        <div key={complaint.id} className="bg-white rounded-2xl shadow-sm border border-amber-100 flex overflow-hidden">
          <img src={complaint.image} className="w-24 h-24 object-cover" />
          <div className="p-3 flex-1">
            <div className="flex justify-between items-start">
              <h3 className="font-black text-amber-950">{complaint.productName}</h3>
              <button onClick={() => onDelete(complaint.id)} className="text-red-200">🗑️</button>
            </div>
            <p className="text-[10px] text-amber-900/70 truncate">{complaint.description}</p>
            {complaint.aiAnalysis && (
              <div className={`mt-1 inline-block px-2 py-0.5 rounded text-[8px] font-black ${getUrgencyColor(complaint.aiAnalysis.urgency)}`}>
                AI: {complaint.aiAnalysis.urgency}
              </div>
            )}
            <div className="mt-2 text-[8px] text-amber-400 font-bold">{complaint.date}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ComplaintList;
