'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '@/components/ui/select';
import { CheckCircle } from 'lucide-react'; // Import the icon
import { Identifier, identifierImages } from '@/types';

interface IdentifierListProps {
  identifiers: Identifier[];
  onIdentifierChange: (id: string, field: string, value: string | null) => void;
  onDetailsClick: (identifierIds: string[]) => void; // Update this prop to accept multiple IDs
}

const IdentifierList: React.FC<IdentifierListProps> = ({ identifiers, onIdentifierChange, onDetailsClick }) => {
  const [loadingIds, setLoadingIds] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]); // State for multiple selected identifiers

  const handleSearch = async (id: string) => {
    const identifier = identifiers?.find(identifier => identifier.id === id);
    if (!identifier) return;

    if (loadingIds.includes(id)) {
      return; // Prevent multiple simultaneous searches
    }

    setLoadingIds(prev => [...prev, id]);

    const encodedQuery = encodeURIComponent(identifier.query);
    const encodedType = encodeURIComponent(identifier.type);

    try {
      const response = await fetch(`/api/search?query=${encodedQuery}&type=${encodedType}&identifierId=${identifier.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ force: true }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      onIdentifierChange(id, 'results', data);
      setError('');
    } catch (err: any) {
      setError(err.message);
      onIdentifierChange(id, 'results', null);
    } finally {
      setLoadingIds(prev => prev.filter(loadingId => loadingId !== id));
    }
  };

  const handleSelect = (event: any, identifier: Identifier) => {
    if(event.target.tagName === 'BUTTON' || !identifier.results_json) return; 
    const id = identifier.id;
    setSelectedIds(prevSelectedIds =>
      prevSelectedIds.includes(id)
        ? prevSelectedIds.filter(selectedId => selectedId !== id)
        : [...prevSelectedIds, id]
    );
  };

  const handleExplore = () => {
    onDetailsClick(selectedIds);
  };

  return (
    <div className="max-h-screen flex flex-col">
      <div className="flex justify-between items-center p-2 shadow-md">
        <h2 className="text-lg font-semibold">Identifiers</h2>
        <Button
          className={`bg-green-500 hover:bg-green-600 ${selectedIds.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleExplore}
          type="button"
          disabled={selectedIds.length === 0}
        >
          Explore Identifier
        </Button>
      </div>
      <div className="flex-1 p-3 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {identifiers?.map((identifier: Identifier, index: number) => (
            <div
              key={identifier.id ?? `temp-key-${index}`}
              className={`p-4 border ${identifier.id && selectedIds.includes(identifier.id) ? 'border-blue-500' : 'border-gray-700'} bg-gray-800 rounded-lg cursor-pointer`}
              onClick={identifier.id ? (e) => handleSelect(e, identifier) : undefined}
            >
              <div className="flex items-center mb-2">
                <Image
                  src={identifierImages[identifier.type as keyof typeof identifierImages]}
                  alt={identifier.type}
                  width={100}
                  height={100}
                  className="object-cover rounded-lg"
                />
                {identifier.results_json && (
                  <CheckCircle className="text-green-500 w-6 h-6 ml-2" />
                )}
              </div>
              <Select
                onValueChange={(value) => onIdentifierChange(identifier.id, 'type', value)}
                value={identifier.type}
              >
                <SelectTrigger className="bg-gray-800 text-white border-gray-700 mb-2">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="username">Username</SelectItem>
                  <SelectItem value="fullname">Fullname</SelectItem>
                  <SelectItem value="socialurl">Social URL</SelectItem>
                  <SelectItem value="telegramid">Telegram ID</SelectItem>
                  <SelectItem value="reverseimage">Reverse Image</SelectItem>
                  <SelectItem value="facename">Face and Name</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={identifier.query}
                onChange={(e) => onIdentifierChange(identifier.id, 'query', e.target.value)}
                placeholder="Enter query"
                className="bg-gray-800 text-white border-gray-700 mb-2"
              />
              <div className="flex space-x-2">
                <Button
                  className={`bg-blue-500 hover:bg-blue-600 ${loadingIds.includes(identifier.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={identifier.id ? () => handleSearch(identifier.id) : undefined}
                  type="button"
                  disabled={!identifier.id || loadingIds.includes(identifier.id)}
                >
                  {loadingIds.includes(identifier.id) ? 'Searching...' : 'Search'}
                </Button> 
              </div>
            </div>
          ))}
        </div>
      </div>
      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
};

export default IdentifierList;
