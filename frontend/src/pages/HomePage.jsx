import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/layout/Sidebar';
import TabManager from '../components/tabs/TabManager';
import { TabProvider, useTabs } from '../context/TabContext';
import api from '../services/api';

function HomePageLayout() {
  const { openProblem, openCreateTab } = useTabs();
  
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProblems = useCallback(async () => {
    try {
      const response = await api.get('problems');
      setProblems(response.data);
    } catch (err) {
      console.error('Error fetching problems:', err);
      setError('Failed to load problems from server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  return (
    <div className="h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="h-14 border-b border-slate-800 px-4 flex items-center justify-between">
        <h1 className="font-semibold">LeetCode Notes</h1>
        <a href="/settings" className="text-sm text-indigo-400 hover:text-indigo-300">
          Settings
        </a>
      </header>

      <div className="flex flex-1 min-h-0">
        <Sidebar
          problems={problems}
          loading={loading}
          error={error}
          onSelectProblem={(problem) => openProblem(problem)}
          onCreateProblem={openCreateTab}
        />

        <main className="flex-1 min-w-0">
          {/* Pass refresh callback down to your TabManager/Tab renderer */}
          <TabManager onDataChange={fetchProblems} />
        </main>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <TabProvider>
      <HomePageLayout />
    </TabProvider>
  );
}