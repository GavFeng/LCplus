import React from 'react';
import ProblemList from '../problems/ProblemList';

export default function Sidebar({ problems, loading, error, onSelectProblem, onCreateProblem }) {
  return (
    <aside className="w-72 border-r border-slate-800 bg-slate-900 flex flex-col h-full">
      <div className="p-3 border-b border-slate-800">
        <button
          onClick={onCreateProblem}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + New Problem
        </button>
      </div>

      {/* Problem Search and List Area */}
      <div className="flex-1 overflow-hidden p-3">
        {loading ? (
          <div className="flex items-center justify-center h-full text-xs text-slate-500">
            Loading problems...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-xs text-rose-400 text-center px-4">
            {error}
          </div>
        ) : (
          <ProblemList problems={problems} onSelectProblem={onSelectProblem} />
        )}
      </div>
    </aside>
  );
}