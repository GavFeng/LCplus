import { useTabs } from '../../context/TabContext';
import TabBar from './TabBar';
import TabContent from './TabContent';
import DefaultTab from './DefaultTab';

export default function TabManager() {
  const { tabs } = useTabs();

  if (tabs.length === 0) {
    return <DefaultTab />;
  }

  return (
    <div className="h-full flex flex-col">
      <TabBar />
      <TabContent />
    </div>
  );
}