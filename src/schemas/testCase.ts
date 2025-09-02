import z from 'zod';

export const testCaseSchema = z.object({
  id: z.string().optional(),
  rule_id: z.string().min(1, 'Rule ID is required'),
  input_facts: z.record(z.string(), z.unknown()),
  expected_output: z.record(z.string(), z.unknown()).optional(),
  actual_output: z.record(z.string(), z.unknown()).optional(),
})

export type TestCase = z.infer<typeof testCaseSchema>