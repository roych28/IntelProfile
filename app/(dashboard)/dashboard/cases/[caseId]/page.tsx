'use client';

import * as z from 'zod';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
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
import { useCases } from '@/app/lib/data-provider';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  id: z.string().optional(),
  identifiers: z.array(z.object({
    id: z.string(),
    case_id: z.string(),
    type: z.string(),
    query: z.string(),
    image_url: z.string().optional(),
  })).optional(),
});

type CaseFormValues = z.infer<typeof formSchema>;

interface CaseFormProps {
  initialData?: CaseFormValues | null;
}

const identifierImages = {
  'email': '/email.jpg',
  'phone': '/phone.jpg',
  'username': '/username.jpg',
  'fullname': '/fullname.jpg',
  'socialurl': '/social-url.jpg',
  'telegramid': '/telegram.jpg',
  'reverseimage': '/reverse-image.jpg',
  'facename': '/face-and-name.jpg',
};

const CaseForm: React.FC<CaseFormProps> = ({ initialData }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { caseId } = useParams();

  const title = initialData ? 'Edit Case' : 'Create Case';
  const toastMessage = initialData ? 'Case updated.' : 'Case created.';
  const action = initialData ? 'Save changes' : 'Create';

  const defaultValues = initialData
    ? initialData
    : {
        name: '',
        identifiers: [],
      };

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
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      router.refresh();
      router.push(`/dashboard/cases`);
      toast({
        variant: 'default',
        title: toastMessage,
        description: 'Case has been successfully saved.'
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.'
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
        description: 'The case has been successfully deleted.'
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description="" />
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
                      className="bg-gray-800 text-white border-gray-700"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {initialData && initialData.identifiers && (
            <div>
              <h2 className="text-lg font-semibold">Identifiers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {initialData.identifiers.map((identifier) => (
                  <Link key={identifier.id} href={`/cases/${identifier.case_id}/identifiers/${identifier.id}`}>
                    <div className="p-4 border border-gray-700 bg-gray-800 rounded-lg cursor-pointer">
                      <Image
                        src={identifierImages[identifier.type]}
                        alt={identifier.type}
                        width={100} // Specify width
                        height={100} // Specify height
                        className="object-cover rounded-lg mb-2"
                      />
                      <p><strong>Type:</strong> {identifier.type}</p>
                      <p><strong>Query:</strong> {identifier.query}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          <Button disabled={loading} className="ml-auto bg-blue-500 hover:bg-blue-600" type="submit">
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
  
  const caseIdString = Array.isArray(caseId) ? caseId[0] : caseId;

  const caseDetails = getCaseById(caseIdString);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {caseId && caseDetails ? (
        <CaseForm initialData={caseDetails} />
      ) : (
        <CaseForm />
      )}
    </div>
  );
};

export default CasePage;
