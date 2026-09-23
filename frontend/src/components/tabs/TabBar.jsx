import { useTabs } from '../../context/TabContext';

export default function TabBar() {
  const { tabs, activeTabId, setActiveTabId, closeTab } = useTabs();

  return (
    <div className="flex items-center bg-slate-900 border-b border-slate-800 overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <div
            key={tab.id}
            onClick={() => setActiveTabId(tab.id)}
            className={`group flex items-center gap-2 px-4 py-2.5 text-sm border-r border-slate-800 cursor-pointer select-none transition-colors ${
              isActive
                ? 'bg-slate-950 text-white border-t-2 border-t-indigo-500'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <span className="truncate max-w-[150px]">{tab.title}</span>
            <button
              onClick={(e) => closeTab(tab.id, e)}
              className="p-0.5 rounded-md hover:bg-slate-700 text-slate-500 hover:text-slate-200 transition-colors"
              title="Close tab"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}