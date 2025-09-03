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

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '' || isNaN(parseFloat(value))) {
      updateFactInput(fact.name, 0)
    }
  }

  return (
    <Input
      type="number"
      value={factInputs[fact.name] as number}
      onChange={(e) => updateFactInput(fact.name, parseFloat(e.target.value))}
      onBlur={handleBlur}
    />
  )
}

export default TestEngineNumber