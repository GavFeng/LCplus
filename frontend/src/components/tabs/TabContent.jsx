import { useTabs } from '../../context/TabContext';
import ProblemForm from '../problems/ProblemForm';
import Problem from '../problems/Problem';

export default function TabContent() {
  const { tabs, activeTabId } = useTabs();
  const activeTab = tabs.find((t) => t.id === activeTabId);

  if (!activeTab) return null;

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-950">
      {activeTab.type === 'create' ? (
        <ProblemForm />
      ) : activeTab.type === 'problem' ? (
        <Problem problem={activeTab.data} />
      ) : null}
    </div>
  );
}