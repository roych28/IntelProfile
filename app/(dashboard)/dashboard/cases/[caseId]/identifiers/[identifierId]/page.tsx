'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { searchTypes } from '@/types';
import BreadCrumb from '@/components/breadcrumb';
import { useCases } from '@/app/lib/data-provider';
import { Identifier } from '@/types';


interface SearchResult {
  id: number;
  identifier_id: string;
  query: string;
  type: string;
  data: any;
  status: string;
  created_at: string;
}

const IdentifierPage = () => {
  const { caseId, identifierId } = useParams();
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState(searchTypes[0]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { getCaseById } = useCases();

  const caseIdString = Array.isArray(caseId) ? caseId[0] : caseId;
  const caseDetails = getCaseById(caseIdString);

  const [identifierDetails, setIdentifierDetails] = useState<Identifier | null>(null);

  useEffect(() => {
    if (caseDetails) {
      const foundIdentifier = caseDetails.identifiers?.find((identifier: Identifier) => identifier.id === identifierId);
      if (foundIdentifier) {
        setIdentifierDetails(foundIdentifier);
        setQuery(foundIdentifier.query);
        setSearchType(foundIdentifier.type);
        setResults(foundIdentifier.results || []);
      } else {
        setError('Identifier not found.');
      }
    }
  }, [caseDetails, identifierId]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const encodedQuery = encodeURIComponent(query);
    const encodedType = encodeURIComponent(searchType);

    try {
      const response = await fetch(`/api/search?query=${encodedQuery}&type=${encodedType}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data: SearchResult[] = await response.json();
      setResults(data);
    } catch (err: any) {
      setError('Failed to fetch results. Please try again.');
      setResults([]);
    }

    setLoading(false);
  };

  const breadcrumbItems = [
    { title: 'cases', link: '/dashboard/cases' },
    { title: `${caseDetails?.name || 'loading...'}`, link: `/dashboard/cases/${caseId}` },
    { title: `${identifierDetails?.id || 'identifier'}`, link: `/dashboard/cases/${caseId}/identifier/${identifierId}` }
  ];

  return (
    <div className="p-4 bg-gray-900 text-white rounded-lg min-h-screen">
      <BreadCrumb items={breadcrumbItems} />
      <h1 className="text-2xl font-semibold mb-4">Identifier Search</h1>
      {identifierDetails ? (
        <>
          <form onSubmit={handleSearch} className="space-y-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter query data"
              className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded"
              required
            />
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded"
            >
              {searchTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="w-full p-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
          {loading && (
            <div className="mt-4 text-yellow-500 text-center">
              <span className="loader"></span> Loading...
            </div>
          )}
          {error && <div className="mt-4 text-red-500">{error}</div>}
          {!loading && results.length > 0 && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">
                Search Results
              </h2>
              <ul className="space-y-2 max-h-96 overflow-y-auto">
                {results.map((result, index) => (
                  <li key={index} className="p-2 bg-gray-800 rounded border border-gray-700">
                    <p><strong>ID:</strong> {result.id}</p>
                    <p><strong>Query:</strong> {result.query}</p>
                    <p><strong>Type:</strong> {result.type}</p>
                    <p><strong>Status:</strong> {result.status}</p>
                    <p><strong>Created At:</strong> {new Date(result.created_at).toLocaleString()}</p>
                    <p><strong>Data:</strong> <pre>{JSON.stringify(result.data, null, 2)}</pre></p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        caseDetails ? (
          <div className="text-red-500">Identifier not found.</div>
        ) : (
          <div className="text-yellow-500">Loading case details...</div>
        )
      )}
    </div>
  );
};

export default IdentifierPage;
