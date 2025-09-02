import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select'
import React from 'react'

type TestEngineBooleanProps = {
  fact: {
    name: string
  }
  factInputs: Record<string, unknown>
  updateFactInput: (factName: string, value: unknown) => void
}

const TestEngineBoolean = (props: TestEngineBooleanProps) => {
  const { fact, factInputs, updateFactInput } = props

  return (
    <Select
      value={factInputs[fact.name] ? "true" : "false"}
      onValueChange={(value) => updateFactInput(fact.name, value === "true")}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="true">True</SelectItem>
        <SelectItem value="false">False</SelectItem>
      </SelectContent>
    </Select>
  )
}

export default TestEngineBoolean