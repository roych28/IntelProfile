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
import { Identifier } from '@/types';

const identifierImages: Record<string, string> = {
  'email': '/email.jpg',
  'phone': '/phone.jpg',
  'username': '/username.jpg',
  'fullname': '/fullname.jpg',
  'socialurl': '/social-url.jpg',
  'telegramid': '/telegram.jpg',
  'reverseimage': '/reverse-image.jpg',
  'facename': '/face-and-name.jpg',
};

interface IdentifierListProps {
  identifiers: Identifier[];
  onIdentifierChange: (id: string, field: string, value: string) => void;
  onDetailsClick: (identifierId: string) => void;
}

const IdentifierList: React.FC<IdentifierListProps> = ({ identifiers, onIdentifierChange, onDetailsClick }) => {
  const [loadingIds, setLoadingIds] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handleSearch = async (id: string) => {
    const identifier = identifiers.find(identifier => identifier.id === id);
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

  return (
    <div>
      <h2 className="text-lg font-semibold">Identifiers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {identifiers.map((identifier: Identifier) => (
          <div key={identifier.id} className="p-4 border border-gray-700 bg-gray-800 rounded-lg">
            <div className="flex items-center mb-2">
              <Image
                src={identifierImages[identifier.type as keyof typeof identifierImages]}
                alt={identifier.type}
                width={100}
                height={100}
                className="object-cover rounded-lg"
              />
              {identifier.results && (
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
                onClick={() => handleSearch(identifier.id)}
                type="button"
                disabled={loadingIds.includes(identifier.id)}
              >
                {loadingIds.includes(identifier.id) ? 'Searching...' : 'Search'}
              </Button>
              <Button
                className="bg-green-500 hover:bg-green-600"
                onClick={() => onDetailsClick(identifier.id)}
                type="button"
              >
                Details
              </Button>
            </div>
          </div>
        ))}
      </div>
      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
};

export default IdentifierList;
