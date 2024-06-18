'use client';

import * as z from 'zod';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
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

const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
});

type CaseFormValues = z.infer<typeof formSchema>;

interface CaseFormProps {
  initialData?: CaseFormValues | null;
}

const CaseForm: React.FC<CaseFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const title = initialData ? 'Edit Case' : 'Create Case';
  const description = initialData ? 'Edit the case details.' : 'Add a new case';
  const toastMessage = initialData ? 'Case updated.' : 'Case created.';
  const action = initialData ? 'Save changes' : 'Create';

  const defaultValues = initialData
    ? initialData
    : {
        name: '',
      };

  const form = useForm<CaseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: CaseFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        // await axios.post(`/api/cases/edit-case/${initialData.id}`, data);
      } else {
        // await axios.post(`/api/cases/create-case`, data);
      }
      router.refresh();
      router.push(`/cases`);
      toast({
        title: toastMessage,
        description: 'Case has been successfully saved.',
        status: 'success',
      });
    } catch (error: any) {
      toast({
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      // await axios.delete(`/api/cases/${params.caseId}`);
      router.refresh();
      router.push(`/cases`);
    } catch (error: any) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
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
      </div>
      <Separator />
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
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

const CasePage = () => {
  const { caseId } = useParams();
  const { getCaseById } = useCases();
  const caseDetails = getCaseById(caseId);

  return (
    <div>
      {caseId && caseDetails ? (
        <CaseForm initialData={caseDetails} />
      ) : (
        <CaseForm />
      )}
    </div>
  );
};

export default CasePage;
