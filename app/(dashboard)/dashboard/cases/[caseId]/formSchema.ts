import * as z from 'zod';

export const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  id: z.string().optional(),
  identifiers: z.array(z.object({
    id: z.string().optional(),
    case_id: z.string(),
    type: z.string(),
    query: z.string(),
  })).optional(),
});

export type CaseFormValues = z.infer<typeof formSchema>;
