'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { CaseFormValues, formSchema } from './formSchema';
import IdentifierList from './IdentifierList';
import AddIdentifierForm from './AddIdentifierForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash } from 'lucide-react'; // Import the Trash icon

interface CaseFormProps {
  initialData?: CaseFormValues | null;
}

const CaseForm: React.FC<CaseFormProps> = ({ initialData }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { caseId } = useParams();

  const title = initialData ? 'Edit Case' : 'Create Case';
  const toastMessage = initialData ? 'Case updated.' : 'Case created.';
  const action = initialData ? 'Save changes' : 'Create';

  const [identifiers, setIdentifiers] = useState(initialData?.identifiers || []);

  const defaultValues = initialData ? initialData : { name: '', identifiers: [] };

  const form = useForm<CaseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: CaseFormValues) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/cases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      router.refresh();
      router.push(`/dashboard/cases`);
      toast({
        variant: 'default',
        title: toastMessage,
        description: 'Case has been successfully saved.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      });
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/cases/${caseId}`, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      router.refresh();
      router.push(`/cases`);
      toast({
        variant: 'default',
        title: 'Case deleted.',
        description: 'The case has been successfully deleted.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleIdentifierChange = (id: string, field: string, value: string) => {
    setIdentifiers((prev) =>
      prev.map((identifier) =>
        identifier.id === id ? { ...identifier, [field]: value } : identifier
      )
    );
  };

  const addIdentifier = (type: string, query: string) => {
    const newId = Math.random().toString();
    const updatedIdentifiers = [...identifiers, { id: newId, case_id: caseId, type, query }];
    setIdentifiers(updatedIdentifiers);
    form.setValue('identifiers', updatedIdentifiers);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description="" />
        <div className="flex space-x-4">
          {initialData && (
            <Button
              disabled={loading}
              variant="destructive"
              size="sm"
              onClick={onDelete}
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
          <Button disabled={loading} className="bg-blue-500 hover:bg-blue-600" onClick={form.handleSubmit(onSubmit)}>
            {action}
          </Button>
        </div>
      </div>
      <Separator />
      <div className="max-h-[70vh] overflow-y-auto p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
            <div className="gap-8 md:grid md:grid-cols-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Case name"
                        className="bg-gray-800 text-white border-gray-700"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <IdentifierList identifiers={identifiers} onIdentifierChange={handleIdentifierChange} />
            <AddIdentifierForm onAdd={addIdentifier} />
          </form>
        </Form>
      </div>
    </>
  );
};

export default CaseForm;
