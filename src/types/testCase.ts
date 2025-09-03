import { Json, Database } from '@/lib/database.types'


export interface TestCase {
  id: string
  rule_id: string
  input_facts: Record<string, Json>
  expected_output: Record<string, Json>
  actual_output?: Record<string, Json>
  created_at: string
  updated_at: string
  rules?: Database['public']['Tables']['rules']['Row']
}