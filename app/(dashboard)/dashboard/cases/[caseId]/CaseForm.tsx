'use client';

import { useState, useEffect } from 'react';
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
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { CaseFormValues, formSchema } from './formSchema';
import IdentifierList from './IdentifierList';
import AddIdentifierToolbar from './AddIdentifierToolbar';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash } from 'lucide-react'; // Import the Trash icon
import { Identifier } from '@/types';
import { useCases } from '@/app/lib/data-provider';

interface CaseFormProps {
  initialData?: CaseFormValues | null;
}

const CaseForm: React.FC<CaseFormProps> = ({ initialData }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { caseId } = useParams();
  const { refetchCases } = useCases();

  const toastMessage = initialData ? 'Case updated.' : 'Case created.';
  const action = initialData ? 'Save' : 'Create';

  const [identifiers, setIdentifiers] = useState<Identifier[]>([]);

  const defaultValues = initialData ? initialData : { name: '', identifiers: [] };

  const form = useForm<CaseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const isNewCase = caseId === 'new';

  useEffect(() => {
    if (initialData?.identifiers) {
      setIdentifiers(initialData.identifiers || []);
    }
  }, [initialData]);

  const onSubmit = async (data: CaseFormValues) => {
    try {
      setLoading(true);
      if (isNewCase) 
        data.identifiers = undefined;
      else
        data.identifiers = identifiers || [];

      const response = await fetch(`/api/cases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      await refetchCases();
      if (isNewCase) {
        router.push(`/dashboard/cases`);
      }
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
      const response = await fetch(`/api/cases?id=${caseId}`, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      router.push(`/dashboard/cases`);
      await refetchCases();
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

  const handleIdentifierChange = (id: string, field: string, value: string | null) => {
    setIdentifiers((prev = []) =>
      prev.map((identifier) =>
        identifier.id === id ? { ...identifier, [field]: value } : identifier
      )
    );

    if(refetchCases)
      refetchCases();
  };

  const addIdentifier = (type: string, query: string) => {
    const caseIdString = Array.isArray(caseId) ? caseId[0] : caseId;
    const newIdentifier: Identifier = {
      case_id: caseIdString,
      type,
      query,
    };
    const updatedIdentifiers = [...identifiers, newIdentifier];
    setIdentifiers(updatedIdentifiers);
    form.setValue('identifiers', updatedIdentifiers);
    form.trigger('identifiers'); // Mark the form as dirty
  };

  const goToDetails = (identifierIds: string[]) => {
    const idsString = identifierIds.join(',');
    router.push(`/dashboard/cases/${caseId}/identifiers?ids=${idsString}`);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        {!isNewCase && <AddIdentifierToolbar onAdd={addIdentifier} />}
        <div className="flex items-center space-x-2">
          {initialData && (
            <Button
              disabled={loading}
              variant="destructive"
              type="button"
              onClick={onDelete}
            >
              <Trash className="h-5 w-5" />
            </Button>
          )}
          <Button
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600"
            onClick={form.handleSubmit(onSubmit)}
            type="button" 
          >
            {action}
          </Button>
        </div>
      </div>
      <div className="mb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Case Name</FormLabel>
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
            {!isNewCase && <IdentifierList
              identifiers={identifiers}
              onIdentifierChange={handleIdentifierChange}
              onDetailsClick={goToDetails} // Pass the function for handling details click
            />}
          </form>
        </Form>
      </div>
    </>
  );
};

export default CaseForm;
