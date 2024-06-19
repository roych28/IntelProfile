import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '@/components/ui/select';

interface AddIdentifierFormProps {
  onAdd: (type: string, query: string) => void;
}

const AddIdentifierForm: React.FC<AddIdentifierFormProps> = ({ onAdd }) => {
  const [newIdentifier, setNewIdentifier] = useState({ type: '', query: '' });

  const handleNewIdentifierChange = (field: string, value: string) => {
    setNewIdentifier((prev) => ({ ...prev, [field]: value }));
  };

  const addIdentifier = () => {
    if (newIdentifier.type && newIdentifier.query) {
      onAdd(newIdentifier.type, newIdentifier.query);
      setNewIdentifier({ type: '', query: '' });
    }
  };

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold">Add New Identifier</h2>
      <div className="flex space-x-4 items-center">
        <Select
          onValueChange={(value) => handleNewIdentifierChange('type', value)}
          value={newIdentifier.type}
        >
          <SelectTrigger className="bg-gray-800 text-white border-gray-700 p-2 rounded-lg" >
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
          value={newIdentifier.query}
          onChange={(e) => handleNewIdentifierChange('query', e.target.value)}
          placeholder="Enter query"
          className="bg-gray-800 text-white border-gray-700"
        />
        <Button onClick={addIdentifier} type="button" className="bg-blue-500 hover:bg-blue-600">
          Add
        </Button>
      </div>
    </div>
  );
};

export default AddIdentifierForm;
