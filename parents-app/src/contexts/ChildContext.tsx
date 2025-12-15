import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Child, ChildContextType } from '../types';
import { useAuth } from './AuthContext';
import { useChildren } from '../hooks/useQueries';
import { storage, STORAGE_KEYS } from '../utils/storage';

// Create context
const ChildContext = createContext<ChildContextType | undefined>(undefined);

// Provider component
interface ChildProviderProps {
  children: ReactNode;
}

export function ChildProvider({ children }: ChildProviderProps) {
  const { state: authState } = useAuth();
  const { data: childrenData = [], isLoading } = useChildren();
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  // Load selected child from storage on mount
  useEffect(() => {
    const loadSelectedChild = async () => {
      if (authState.isAuthenticated && childrenData.length > 0) {
        try {
          const savedChildId = await storage.getItem<string>(STORAGE_KEYS.SELECTED_CHILD_ID);
          if (savedChildId) {
            const savedChild = childrenData.find(child => child.id === savedChildId);
            if (savedChild) {
              setSelectedChild(savedChild);
              return;
            }
          }
          // If no saved child or saved child not found, select first child
          setSelectedChild(childrenData[0]);
        } catch (error) {
          console.error('Failed to load selected child:', error);
          setSelectedChild(childrenData[0]);
        }
      }
    };

    loadSelectedChild();
  }, [authState.isAuthenticated, childrenData]);

  // Clear selected child on logout
  useEffect(() => {
    if (!authState.isAuthenticated) {
      setSelectedChild(null);
      storage.removeItem(STORAGE_KEYS.SELECTED_CHILD_ID);
    }
  }, [authState.isAuthenticated]);

  const handleSetSelectedChild = async (child: Child) => {
    setSelectedChild(child);
    try {
      await storage.setItem(STORAGE_KEYS.SELECTED_CHILD_ID, child.id);
    } catch (error) {
      console.error('Failed to save selected child:', error);
    }
  };

  const contextValue: ChildContextType = {
    selectedChild,
    setSelectedChild: handleSetSelectedChild,
    children: childrenData,
  };

  return (
    <ChildContext.Provider value={contextValue}>
      {children}
    </ChildContext.Provider>
  );
}

// Hook to use child context
export function useChild(): ChildContextType {
  const context = useContext(ChildContext);
  if (context === undefined) {
    throw new Error('useChild must be used within a ChildProvider');
  }
  return context;
}

export default ChildContext;