import z from 'zod';

export const outcomeSchema = z.object({
  id: z.string().optional(),
  type: z.string().min(1, 'Outcome type is required'),
  params: z.record(z.string(), z.unknown()).default({}),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
})

export type Outcome = z.infer<typeof outcomeSchema>