import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select'
import React from 'react'
import { Json } from "@/lib/database.types"
import { Fact } from "@/schemas/fact"
import { Condition } from '@/types/rules'

type RuleInputListProps = {
  condition: Condition
  fact: Fact
  index: number
  updateCondition: (index: number, field: 'fact' | 'operator' | 'value', value: Json) => void
}

const RuleInputList = (props: RuleInputListProps) => {
  const { condition, index, updateCondition, fact } = props

  if (condition.operator === 'in' || condition.operator === 'notIn') {
    return (
      <Input
        value={JSON.stringify(condition.value) || '[]'}
        onChange={(e) => {
          try {
            const parsed = JSON.parse(e.target.value)
            updateCondition(index, 'value', parsed)
          } catch {
            updateCondition(index, 'value', e.target.value)
          }
        }}
        placeholder='["option1", "option2"]'
      />
    )
  }

  return (
    <Select
      value={condition.value as string || ''}
      onValueChange={(value) => updateCondition(index, 'value', value)}
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

export default RuleInputList