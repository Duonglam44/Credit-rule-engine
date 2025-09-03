import { Input } from '@/components/ui/input'
import { Json } from '@/lib/database.types'
import { Condition } from '@/types/rules'
import React from 'react'

type RuleInputNumberProps = {
  condition: Condition
  index: number
  updateCondition: (index: number, field: 'fact' | 'operator' | 'value', value: Json) => void
}

const RuleInputNumber = (props: RuleInputNumberProps) => {
  const { condition, index, updateCondition } = props

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '' || isNaN(parseFloat(value))) {
      updateCondition(index, 'value', 0)
    }
  }

  return (
    <Input
      type="number"
      value={condition.value as number}
      onChange={(e) => updateCondition(index, 'value', parseFloat(e.target.value))}
      onBlur={handleBlur}
      placeholder="Number"
    />
  )
}

export default RuleInputNumber