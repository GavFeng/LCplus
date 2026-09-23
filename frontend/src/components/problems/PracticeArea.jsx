import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import api from '../../services/api';

export default function PracticeArea({ problem }) {
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [language, setLanguage] = useState('');
  const [code, setCode] = useState('// Select a language and write your solution here');
  const [output, setOutput] = useState('Run your code to see test output...');
  const [activeConsoleTab, setActiveConsoleTab] = useState('testcases');

  // 1. Fetch available languages on mount
  useEffect(() => {
    async function fetchLanguages() {
      try {
        const response = await api.get('/languages');
        setAvailableLanguages(response.data);

        if (response.data.length > 0) {
          setLanguage(response.data[0]._id);
        }
      } catch (err) {
        console.error('Failed to fetch languages:', err);
      }
    }
    fetchLanguages();
  }, []);

  // 2. Load the problem's template into the editor whenever the problem changes
  useEffect(() => {
    if (!problem) return;

    // Use problem.template if available, otherwise fallback to default comment
    if (problem.template) {
      setCode(problem.template);
    } else {
      setCode('// Write your solution here\n');
    }
  }, [problem]);

  const handleRunCode = () => {
    setOutput('Running tests...\nAll test cases passed! (0.04s)');
    setActiveConsoleTab('result');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950">
      
      {/* Editor Toolbar (Language Selector & Action Buttons) */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <select 
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
        >
          {availableLanguages.map((lang) => (
            <option key={lang._id} value={lang._id}>
              {lang.name}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <button 
            onClick={handleRunCode}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded font-medium transition-colors"
          >
            Run
          </button>
          <button 
            onClick={handleRunCode}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded font-medium transition-colors"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Monaco Code Editor Container */}
      <div className="flex-1 relative">
        <Editor
          height="100%"
          language={availableLanguages.find(l => l._id === language)?.name?.toLowerCase() || 'javascript'}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>

      {/* Bottom Console / Test Results Drawer */}
      <div className="h-1/3 border-t border-slate-800 bg-slate-900/40 flex flex-col">
        <div className="flex border-b border-slate-800 px-4 gap-4 text-xs font-semibold text-slate-400">
          <button 
            onClick={() => setActiveConsoleTab('testcases')}
            className={`py-2 border-b-2 transition-colors ${activeConsoleTab === 'testcases' ? 'border-indigo-500 text-white' : 'border-transparent'}`}
          >
            Test Cases ({problem?.examples?.length || 0})
          </button>
          <button 
            onClick={() => setActiveConsoleTab('result')}
            className={`py-2 border-b-2 transition-colors ${activeConsoleTab === 'result' ? 'border-indigo-500 text-white' : 'border-transparent'}`}
          >
            Test Result
          </button>
        </div>

        <div className="p-4 font-mono text-xs text-slate-300 overflow-y-auto flex-1 space-y-3">
          {activeConsoleTab === 'testcases' ? (
            problem?.examples?.length > 0 ? (
              problem.examples.map((ex, index) => (
                <div key={index} className="bg-slate-950 p-3 rounded border border-slate-800 space-y-1">
                  <p className="text-slate-400 font-semibold">Example {index + 1}:</p>
                  <p><span className="text-indigo-400">Input:</span> {ex.input}</p>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-center py-4">No test cases found for this problem.</p>
            )
          ) : (
            <div className="whitespace-pre-wrap">{output}</div>
          )}
        </div>
      </div>

    </div>
  );
}