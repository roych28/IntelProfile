"use client";

import { useState } from 'react';
import styles from './SearchPage.module.css';

const searchTypes = [
  'Email',
  'Phone Number',
  'Username',
  'Fullname',
  'Social URL',
  'Telegram ID',
  'Reverse Image',
  'Face and Name',
];

interface SearchResult {
  name: string;
  // Add other properties if needed
}

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState(searchTypes[0]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);

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
      setError(err.message);
      setResults([]);
    }

    setLoading(false);
  };

  return (
    <div className={styles.searchContainer}>
      <h1 className={styles.title}>Profile Intelligence Search</h1>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter text (email, phone number, username, etc.)"
          className={styles.searchInput}
          required
        />
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className={styles.searchDropdown}
        >
          {searchTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <button type="submit" className={styles.searchButton} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      {loading && <div className={styles.loading}>Loading...</div>}
      {error && <div className={styles.error}>{error}</div>}
      {!loading && results.length > 0 && (
        <div className={styles.resultsContainer}>
          <h2>Search Results for {query} ({searchType})</h2>
          <ul>
            {results.map((result, index) => (
              <li key={index}>{result.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
