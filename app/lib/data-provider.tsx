'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Case } from '@/types';

type CasesContextType = {
  cases: Case[];
  getCaseById: (id: string) => Case | undefined;
  refetchCases: () => Promise<void>;
};

const CasesContext = createContext<CasesContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cases, setCases] = useState<Case[]>([]);
  const [initialLoading, setInitialLoading] = useState<boolean>(true); // Only for initial loading

  const fetchCases = async () => {
    try {
      const response = await fetch('/api/cases');
      const data = await response.json();
      setCases(data);
    } catch (error) {
      console.error('Error fetching cases:', error);
    }
  };

  useEffect(() => {
    const initialFetch = async () => {
      await fetchCases();
      setInitialLoading(false);
    };
    initialFetch();
  }, []);

  const getCaseById = (id: string) => {
    return cases.find(caseItem => caseItem.id === id);
  };

  const value = useMemo(() => ({
    cases,
    getCaseById,
    refetchCases: fetchCases,
  }), [cases]);

  if (initialLoading) {
    return <div>Loading...</div>; // Show loading state for the initial fetch
  }

  return (
    <CasesContext.Provider value={value}>
      {children}
    </CasesContext.Provider>
  );
};

export const useCases = (): CasesContextType => {
  const context = useContext(CasesContext);
  if (!context) {
    throw new Error('useCases must be used within a CasesProvider');
  }
  return context;
};
