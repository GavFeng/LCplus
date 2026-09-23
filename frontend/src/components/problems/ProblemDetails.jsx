import React from 'react';

const ProblemDetails = ({ problem, activeTab, onEdit }) => {
  if (!problem) {
    return <div className="text-slate-500 text-sm">Select a problem from the sidebar</div>;
  }

  return (
    <div className="space-y-6">
      {/* Title, Difficulty & Edit Button */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">
            {problem.problem}. {problem.name}
          </h2>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {problem.difficulty}
            </span>
            <span className="text-xs text-amber-400">⭐ {problem.stars} stars</span>
          </div>
        </div>
        {onEdit && (
          <button
            onClick={() => onEdit(problem)}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
          >
            ✏️ Edit Problem
          </button>
        )}
      </div>

      {/* Tab Conditional Rendering */}
      {activeTab === 'description' ? (
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Description</h3>
            <p>{problem.description || "No description provided."}</p>
          </div>

          {/* Examples section if available */}
          {problem.examples && problem.examples.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Examples</h3>
              {problem.examples.map((ex, index) => (
                <div key={index} className="bg-slate-950 p-3 rounded-lg border border-slate-800 mb-2 font-mono text-xs">
                  <p><strong className="text-slate-400">Input:</strong> {ex.input}</p>
                  <p><strong className="text-slate-400">Output:</strong> {ex.output}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4 text-slate-300 text-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Solutions & Notes</h3>
          
          {problem.solutions && problem.solutions.length > 0 ? (
            problem.solutions.map((sol, index) => {
              const langName = typeof sol.language === 'object' ? sol.language?.name : 'Solution';

              return (
                <div key={index} className="bg-slate-950 rounded-lg border border-slate-800 overflow-hidden space-y-1">
                  <div className="bg-slate-900 px-3 py-1.5 border-b border-slate-800 text-xs font-medium text-indigo-400">
                    {langName}
                  </div>
                  <pre className="p-3 font-mono text-xs text-slate-300 overflow-x-auto">
                    <code>{sol.code}</code>
                  </pre>
                </div>
              );
            })
          ) : (
            <p className="text-slate-500 italic text-xs">No solutions added yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProblemDetails;