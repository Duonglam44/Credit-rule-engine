import { NextRequest, NextResponse } from 'next/server'
import { ruleEngineService } from '@/lib/rule-engine'

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ ruleId: string }> }
) {
  try {
    const { ruleId } = await context.params
    const results = await ruleEngineService.runAllTestCases(ruleId)
    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to run all test cases',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
