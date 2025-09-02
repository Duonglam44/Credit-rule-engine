import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await request.json()
    
    const updateData = {
      rule_id: body.rule_id,
      input_facts: body.input_facts,
      expected_output: body.expected_output,
      actual_output: body.actual_output,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('test_cases')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        rules!test_cases_rule_id_fkey(*)
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating test case:', error)
    return NextResponse.json(
      { error: 'Failed to update test case' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const { error } = await supabase
      .from('test_cases')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting test case:', error)
    return NextResponse.json(
      { error: 'Failed to delete test case' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    const { data, error } = await supabase
      .from('test_cases')
      .select(`
        *,
        rules!test_cases_rule_id_fkey(*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching test case:', error)
    return NextResponse.json(
      { error: 'Failed to fetch test case' },
      { status: 500 }
    )
  }
}
