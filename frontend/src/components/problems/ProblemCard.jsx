import React from 'react';

const ProblemCard = ({ problem, onClick }) => {
  // Difficulty badge styling helper (consistent with ProblemDetails)
  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy': return 'text-emerald-400 bg-emerald-950/40 border-emerald-800/50';
      case 'medium': return 'text-amber-400 bg-amber-950/40 border-amber-800/50';
      case 'hard': return 'text-rose-400 bg-rose-950/40 border-rose-800/50';
      default: return 'text-slate-400 bg-slate-900 border-slate-800';
    }
  };

  return (
    <div 
      onClick={() => onClick(problem)}
      className="group bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800/80 hover:border-slate-700 p-3 rounded-xl cursor-pointer transition-all space-y-2"
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium text-slate-200 group-hover:text-white line-clamp-1">
          {problem.problem}. {problem.name}
        </h4>
        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium shrink-0 ${getDifficultyColor(problem.difficulty)}`}>
          {problem.difficulty}
        </span>
      </div>
      
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="text-amber-400 flex items-center gap-1">
          ⭐ {problem.stars}
        </span>
        <span className="truncate max-w-[120px] bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-[10px]">
          {problem.tags?.[0]?.name || problem.tags?.[0] || 'General'}
        </span>
      </div>
    </div>
  );
};

export default ProblemCard;