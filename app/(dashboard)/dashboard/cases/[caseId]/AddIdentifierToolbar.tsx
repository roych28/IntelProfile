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

interface AddIdentifierToolbarProps {
  onAdd: (type: string, query: string) => void;
}

const AddIdentifierToolbar: React.FC<AddIdentifierToolbarProps> = ({ onAdd }) => {
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
      <div className="flex space-x-4 items-center">
        <Select
            onValueChange={(value) => handleNewIdentifierChange('type', value)}
            value={newIdentifier?.type || ""}
            >
            <SelectTrigger className="bg-gray-800 text-white border-gray-700 p-2 rounded-lg">
                <SelectValue>{newIdentifier?.type ? newIdentifier.type : "Choose type"}</SelectValue>
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
   
  );
};

export default AddIdentifierToolbar;
