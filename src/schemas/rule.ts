import z from 'zod';

export const ruleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Rule name is required'),
  json_conditions: z.record(z.string(), z.unknown()),
  event_id: z.string().min(1, 'Event ID is required'),
})

export type Rule = z.infer<typeof ruleSchema>