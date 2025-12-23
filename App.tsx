
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ComplaintForm from './components/ComplaintForm';
import ComplaintList from './components/ComplaintList';
import Stats from './components/Stats';
import { Complaint } from './types';

const App: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [view, setView] = useState<'form' | 'history' | 'stats'>('form');

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('berman_complaints');
    if (saved) {
      setComplaints(JSON.parse(saved));
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('berman_complaints', JSON.stringify(complaints));
  }, [complaints]);

  const handleAddComplaint = (newComplaint: Complaint) => {
    setComplaints(prev => [newComplaint, ...prev]);
    setView('history');
  };

  const handleDelete = (id: string) => {
    setComplaints(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="min-h-screen pb-12">
      <Header setView={setView} currentView={view} />
      
      <main className="max-w-5xl mx-auto px-4 mt-8">
        {view === 'form' && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-amber-900 mb-6 border-r-4 border-amber-600 pr-4">הוספת תלונה חדשה</h2>
            <ComplaintForm onAdd={handleAddComplaint} />
          </div>
        )}

        {view === 'history' && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-amber-900 mb-6 border-r-4 border-amber-600 pr-4">היסטוריית תלונות</h2>
            <ComplaintList complaints={complaints} onDelete={handleDelete} />
          </div>
        )}

        {view === 'stats' && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-amber-900 mb-6 border-r-4 border-amber-600 pr-4">סיכום וסטטיסטיקה</h2>
            <Stats complaints={complaints} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
