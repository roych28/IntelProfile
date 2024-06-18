"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Case = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
};

type CasesContextType = {
  cases: Case[];
  getCaseById: (id: string) => Case | undefined;
};

const CasesContext = createContext<CasesContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cases, setCases] = useState<Case[]>([]);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await fetch('/api/cases');
        const data = await response.json();
        setCases(data);
      } catch (error) {
        // console.error('Error fetching cases:', error);
      }
    };

    fetchCases();
  }, []);

  const getCaseById = (id: string) => cases.find(caseItem => caseItem.id === id);

  return (
    <CasesContext.Provider value={{ cases, getCaseById }}>
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
