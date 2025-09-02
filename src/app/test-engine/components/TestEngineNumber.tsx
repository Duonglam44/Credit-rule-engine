import React from 'react'
import { Input } from '@/components/ui/input'
import { Fact } from '@/schemas/fact'

type TestEngineNumberProps = {
  fact: Fact
  factInputs: Record<string, unknown>
  updateFactInput: (factName: string, value: unknown) => void
}

const TestEngineNumber = (props: TestEngineNumberProps) => {
  const { fact, factInputs, updateFactInput } = props

  return (
    <Input
      type="number"
      value={factInputs[fact.name] as number || 0}
      onChange={(e) => updateFactInput(fact.name, parseFloat(e.target.value) || 0)}
    />
  )
}

export default TestEngineNumber