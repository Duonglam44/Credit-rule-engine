import { NextRequest, NextResponse } from 'next/server'
import { ruleEngineService } from '@/lib/rule-engine'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ ruleId: string }> }
) {
  try {
    const { ruleId } = await context.params
    const facts = await ruleEngineService.getFactsForRule(ruleId)
    return NextResponse.json(facts)
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to get facts for rule',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
