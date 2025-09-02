import { Input } from '@/components/ui/input'
import React from 'react'

type TestEngineTextProps = {
  fact: {
    name: string
  }
  factInputs: Record<string, unknown>
  updateFactInput: (factName: string, value: unknown) => void
}

const TestEngineText = (props: TestEngineTextProps) => {
  const { fact, factInputs, updateFactInput } = props

  return (
    <Input
      type="text"
      value={factInputs[fact.name] as string || ""}
      onChange={(e) => updateFactInput(fact.name, e.target.value)}
    />
  )
}

export default TestEngineText