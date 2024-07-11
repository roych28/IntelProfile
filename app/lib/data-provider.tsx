"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Case } from '@/types';

type CasesContextType = {
  cases: Case[];
  getCaseById: (id: string) => Case | undefined;
  loading: boolean;
  refetchCases: () => Promise<void>;
};

const CasesContext = createContext<CasesContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cases');
      const data = await response.json();
      setCases(data);
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const getCaseById = (id: string) => {
    console.log('Searching for case with id:', id);
    const foundCase = cases.find(caseItem => caseItem.id === id);
    console.log('Found case:', foundCase);
    return foundCase;
  };
  
  return (
    <CasesContext.Provider value={{ cases, getCaseById, loading, refetchCases: fetchCases }}>
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
