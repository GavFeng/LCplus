// src/context/TabContext.jsx
import React, { createContext, useContext, useState } from 'react';

const TabContext = createContext();

export const TabProvider = ({ children }) => {
  const [tabs, setTabs] = useState([]);
  const [activeTabId, setActiveTabId] = useState(null);

  // Open or switch to a problem tab (Using problem.name)
  const openProblem = (problem) => {
    const tabId = `problem-${problem._id}`;
    if (!tabs.some((t) => t.id === tabId)) {
      setTabs((prev) => [
        ...prev, 
        { 
          id: tabId, 
          type: 'problem', 
          data: problem, 
          title: `${problem.problem}. ${problem.name}` // Optional: combines number and name nicely
        }
      ]);
    }
    setActiveTabId(tabId);
  };

  // Open the create problem form tab
  const openCreateTab = () => {
    const tabId = 'create-problem';
    if (!tabs.some((t) => t.id === tabId)) {
      setTabs((prev) => [
        ...prev, 
        { id: tabId, type: 'create', data: null, title: 'New Problem' }
      ]);
    }
    setActiveTabId(tabId);
  };

  // Close any tab
  const closeTab = (tabId, e) => {
    if (e) e.stopPropagation();
    setTabs((prev) => {
      const newTabs = prev.filter((t) => t.id !== tabId);
      if (activeTabId === tabId && newTabs.length > 0) {
        setActiveTabId(newTabs[newTabs.length - 1].id);
      } else if (newTabs.length === 0) {
        setActiveTabId(null);
      }
      return newTabs;
    });
  };

  // Replace a tab (Handles Create -> View transition or Edit updates)
  const replaceTab = (oldId, newProblem) => {
    const newId = `problem-${newProblem._id}`;
    setTabs((prev) =>
      prev.map((t) =>
        t.id === oldId
          ? { 
              id: newId, 
              type: 'problem', 
              data: newProblem, 
              title: `${newProblem.problem}. ${newProblem.name}` 
            }
          : t
      )
    );
    setActiveTabId(newId);
  };

  return (
    <TabContext.Provider
      value={{ 
        tabs, 
        activeTabId, 
        setActiveTabId, 
        openProblem, 
        openCreateTab, 
        closeTab, 
        replaceTab 
      }}
    >
      {children}
    </TabContext.Provider>
  );
};

export const useTabs = () => useContext(TabContext);