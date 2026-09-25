import React, { useState } from 'react';
import NotesPanel from './NotesPanel';

const ProblemDetails = ({ problem, activeTab, onEdit, onSaveNotes }) => {
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  if (!problem) {
    return <div className="text-slate-500 text-sm">Select a problem from the sidebar</div>;
  }

  console.log("Current problem data:", problem);

  const handleSaveNotes = async (newContent) => {
    if (onSaveNotes) {
      await onSaveNotes(problem._id, newContent);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Title & Difficulty Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">
            {problem.problem}. {problem.name}
          </h2>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
              {problem.difficulty}
            </span>
            <span className="text-xs text-amber-400">⭐ {problem.stars} stars</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Notes Toggle Button */}
          <button
            onClick={() => setIsNotesOpen(true)}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-amber-400 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            📝 Notes {problem.notes ? '•' : ''}
          </button>

          {onEdit && (
            <button
              onClick={() => onEdit(problem)}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
            >
              ✏️ Edit Problem
            </button>
          )}
        </div>
      </div>

      {/* Tab Conditional Rendering */}
      {activeTab === 'description' ? (
        <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Description</h3>
            <p className="whitespace-pre-wrap">{problem.description || "No description provided."}</p>
          </div>

          {/* Constraints Section */}
          {problem.constraints && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Constraints</h3>
              <p className="text-slate-300 whitespace-pre-wrap font-mono text-xs bg-slate-950 p-3 rounded-lg border border-slate-800">
                {problem.constraints}
              </p>
            </div>
          )}

          {/* Examples section with full details and images */}
          {problem.examples && problem.examples.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Examples</h3>
              {problem.examples.map((ex, index) => (
                <div key={index} className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2 text-xs">
                  <div className="font-mono space-y-1">
                    <p><strong className="text-slate-400">Input:</strong> {ex.input}</p>
                    <p><strong className="text-slate-400">Output:</strong> {ex.output}</p>
                  </div>
                  
                  {ex.explanation && (
                    <div className="text-slate-300 pt-1 border-t border-slate-900">
                      <strong className="text-slate-400">Explanation:</strong> {ex.explanation}
                    </div>
                  )}

                  {/* Render Example Images from S3 with error handling */}
                  {ex.images && ex.images.length > 0 && (
                    <div className="pt-2 border-t border-slate-900 flex flex-wrap gap-3">
                      {ex.images.map((img, imgIndex) => {
                        if (!img.url) return null;

                        let cleanUrl = img.url.trim();
                        if (!cleanUrl.startsWith('http')) {
                          cleanUrl = 'https://' + cleanUrl;
                        }

                        return (
                          <div key={imgIndex} className="space-y-1">
                            <img
                              src={cleanUrl}
                              alt={`Example ${index + 1} Visual ${imgIndex + 1}`}
                              className="max-h-48 rounded border border-slate-800 bg-slate-900 object-contain"
                              onError={(e) => {
                                console.error('Image failed to load:', e.target.src);
                                e.target.parentElement.style.display = 'none';
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4 text-slate-300 text-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Solutions & Approaches</h3>
          
          {problem.solutions && problem.solutions.length > 0 ? (
            problem.solutions.map((sol, index) => {
              const langName = typeof sol.language === 'object' ? sol.language?.name : 'Solution';

              return (
                <div key={index} className="bg-slate-950 rounded-lg border border-slate-800 overflow-hidden space-y-3 p-4">
                  {/* Header bar: Language & Approach name */}
                  <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-2 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide">
                        {langName}
                      </span>
                      {sol.approach && (
                        <span className="text-xs text-slate-400">
                          — <span className="text-white font-medium">{sol.approach}</span>
                        </span>
                      )}
                    </div>
                    
                    {/* Complexities Badges */}
                    <div className="flex items-center gap-3 text-xs">
                      {sol.timeComplexity && (
                        <span className="text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          Time: <strong className="text-slate-200 font-mono">{sol.timeComplexity}</strong>
                        </span>
                      )}
                      {sol.spaceComplexity && (
                        <span className="text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          Space: <strong className="text-slate-200 font-mono">{sol.spaceComplexity}</strong>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Solution Explanation */}
                  {sol.explanation && (
                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {sol.explanation}
                    </p>
                  )}

                  {/* Code Block */}
                  <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
                    <div className="bg-slate-900/80 px-3 py-1 text-[10px] uppercase font-mono text-slate-500 border-b border-slate-800">
                      Implementation
                    </div>
                    <pre className="p-3 font-mono text-xs text-slate-300 overflow-x-auto">
                      <code>{sol.code}</code>
                    </pre>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-slate-500 italic text-xs">No solutions added yet.</p>
          )}
        </div>
      )}

      {/* Render the extracted Notes Panel component as a child of the relative wrapper */}
      <NotesPanel
        isOpen={isNotesOpen}
        initialContent={problem.notes}
        onClose={() => setIsNotesOpen(false)}
        onSave={handleSaveNotes}
      />
    </div>
  );
};

export default ProblemDetails;