import { NextRequest, NextResponse } from 'next/server'
import { ruleEngineService } from '@/lib/rule-engine'

export async function POST(request: NextRequest) {
  try {
    const { ruleId, factInputs } = await request.json()

    if (!ruleId || !factInputs) {
      return NextResponse.json(
        { error: 'Missing ruleId or factInputs' },
        { status: 400 }
      )
    }

    const result = await ruleEngineService.runRule(ruleId, factInputs)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to run rule',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
