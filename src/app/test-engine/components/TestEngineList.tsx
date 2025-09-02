import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select'
import React from 'react'

type TestEngineListProps = {
  fact: {
    name: string
    options?: string[]
  }
  factInputs: Record<string, unknown>
  updateFactInput: (name: string, value: unknown) => void
  
}

const TestEngineList = (props: TestEngineListProps) => {
  const { fact, factInputs, updateFactInput } = props

  return (
    <Select
      value={factInputs[fact.name] as string || ""}
      onValueChange={(value) => updateFactInput(fact.name, value)}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {fact.options?.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default TestEngineList