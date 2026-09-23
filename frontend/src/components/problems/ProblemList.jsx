import React from 'react';
import ProblemCard from './ProblemCard';

const ProblemList = ({ problems = [], onSelectProblem }) => {
  const safeProblems = Array.isArray(problems) ? problems : [];

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Scrollable Problem Cards Container */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {safeProblems.length > 0 ? (
          safeProblems.map((prob) => (
            <ProblemCard 
              key={prob._id || prob.problem} 
              problem={prob} 
              onClick={onSelectProblem} 
            />
          ))
        ) : (
          <div className="text-center py-8 text-xs text-slate-500 italic">
            No problems available
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemList;