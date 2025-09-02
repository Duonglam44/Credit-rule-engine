

export interface TestResult {
  success: boolean
  events?: Array<{
    type: string
    params: Record<string, unknown>
  }>
  error?: string
  facts: Record<string, unknown>
}

export interface TestRule {
  id: string
  name: string
  outcomes: {
    type: string
    params: Record<string, unknown>
  }
}