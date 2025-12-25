import React from 'react';
import { Complaint, Urgency } from './types';

interface ComplaintListProps {
  complaints: Complaint[];
  onDelete: (id: string) => void;
}

const UrgencyBadge = ({ urgency }: { urgency?: Urgency }) => {
  const colors = {
    [Urgency.CRITICAL]: 'bg-red-600 text-white shadow-lg shadow-red-200',
    [Urgency.HIGH]: 'bg-orange-500 text-white',
    [Urgency.MEDIUM]: 'bg-amber-500 text-white',
    [Urgency.LOW]: 'bg-green-500 text-white',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${urgency ? colors[urgency] : 'bg-gray-400'}`}>
      {urgency || 'לא סווג'}
    </span>
  );
};

const ComplaintList: React.FC<ComplaintListProps> = ({ complaints, onDelete }) => {
  if (complaints.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-amber-100">
        <div className="text-4xl mb-3 opacity-20">🍞</div>
        <p className="text-amber-800 font-bold opacity-40">יומן האיכות ריק כרגע</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-10">
      {complaints.map(complaint => (
        <div key={complaint.id} className="bg-white rounded-[1.5rem] shadow-sm border border-amber-50 overflow-hidden flex flex-col group animate-in fade-in duration-300">
          <div className="flex flex-row">
            {complaint.image && (
              <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 overflow-hidden">
                <img src={complaint.image} className="w-full h-full object-cover" alt="תקלה" />
              </div>
            )}
            <div className="p-4 flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div className="truncate">
                  <h3 className="font-black text-amber-950 text-lg leading-tight truncate">{complaint.productName}</h3>
                  <p className="text-[10px] text-amber-600 font-bold mt-0.5">{complaint.date}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <UrgencyBadge urgency={complaint.aiAnalysis?.urgency} />
                  <button onClick={() => onDelete(complaint.id)} className="text-amber-200 hover:text-red-600 p-1 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
              <p className="text-xs text-amber-900/80 mt-2 font-medium bg-amber-50/50 p-2 rounded-lg italic border border-amber-100/30 line-clamp-2">
                "{complaint.description}"
              </p>
            </div>
          </div>
          
          {complaint.aiAnalysis && (
            <div className="px-4 pb-4">
              <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-100">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black text-amber-900 bg-amber-200 px-1.5 py-0.5 rounded uppercase">ניתוח AI</span>
                  <span className="text-[10px] font-bold text-amber-700 opacity-60">• {complaint.aiAnalysis.category}</span>
                </div>
                <p className="text-[11px] font-bold text-amber-900 leading-relaxed mb-1">
                  {complaint.aiAnalysis.summary}
                </p>
                {complaint.aiAnalysis.visualFindings && (
                  <p className="text-[10px] text-amber-700 italic border-t border-amber-200/50 pt-1 mt-1">
                    🔍 ממצא ויזואלי: {complaint.aiAnalysis.visualFindings}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ComplaintList;
