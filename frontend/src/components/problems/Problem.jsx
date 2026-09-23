import React, { useState, useRef, useCallback } from 'react';
import ProblemDetails from './ProblemDetails';
import PracticeArea from './PracticeArea';
import ProblemForm from './ProblemForm'; // Import your form component

const Problem = ({ problem, onProblemUpdated }) => {
  const [activeTab, setActiveTab] = useState('description');
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit view

  // Resizable split-pane state (default: 50% split)
  const [leftWidth, setLeftWidth] = useState(50);
  const isDragging = useRef(false);

  const handleMouseDown = (e) => {
    e.preventDefault();
    isDragging.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.classList.add('cursor-col-resize', 'select-none');
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging.current) return;
    const newWidth = (e.clientX / window.innerWidth) * 100;
    if (newWidth >= 20 && newWidth <= 80) {
      setLeftWidth(newWidth);
    }
  }, []);

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.classList.remove('cursor-col-resize', 'select-none');
  };

  // If editing is active, render the ProblemForm instead of the split screen view
  if (isEditing) {
    return (
      <div className="h-screen w-screen overflow-y-auto bg-slate-950 p-6">
        <div className="max-w-3xl mx-auto mb-4">
          <button 
            onClick={() => setIsEditing(false)}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
          >
            ← Cancel / Back to Problem
          </button>
        </div>
        <ProblemForm 
        initialData={problem} 
        onSuccess={(updatedProblem) => {
            setIsEditing(false);
            if (onProblemUpdated) onProblemUpdated(updatedProblem);
        }} 
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen overflow-hidden bg-slate-950 text-white">
      
      {/* Left Pane: Problem Details & Tabs */}
      <div 
        style={{ width: window.innerWidth >= 1024 ? `${leftWidth}%` : '100%' }}
        className="h-1/2 lg:h-full flex flex-col border-r border-slate-800 bg-slate-900/50"
      >
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 px-4 py-2 gap-4 text-sm font-medium text-slate-400">
          <button 
            onClick={() => setActiveTab('description')}
            className={`pb-1 border-b-2 transition-colors ${activeTab === 'description' ? 'border-indigo-500 text-white' : 'border-transparent hover:text-slate-200'}`}
          >
            Description
          </button>
          <button 
            onClick={() => setActiveTab('solutions')}
            className={`pb-1 border-b-2 transition-colors ${activeTab === 'solutions' ? 'border-indigo-500 text-white' : 'border-transparent hover:text-slate-200'}`}
          >
            Solutions
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <ProblemDetails 
            problem={problem} 
            activeTab={activeTab} 
            onEdit={() => setIsEditing(true)} // <-- Passed here to trigger edit mode
          />
        </div>
      </div>

      {/* Resizer Handle (Desktop only) */}
      <div
        onMouseDown={handleMouseDown}
        className="hidden lg:flex w-1.5 bg-slate-800 hover:bg-indigo-500 cursor-col-resize transition-colors items-center justify-center group relative z-10"
      >
        <div className="h-8 w-0.5 bg-slate-600 group-hover:bg-white rounded-full transition-colors"></div>
      </div>

      {/* Right Pane: Practice Area */}
      <div 
        style={{ width: window.innerWidth >= 1024 ? `${100 - leftWidth}%` : '100%' }}
        className="h-1/2 lg:h-full flex flex-col bg-slate-950"
      >
        <PracticeArea problem={problem} />
      </div>

    </div>
  );
};

export default Problem;