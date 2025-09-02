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

  return (
    <Input
      type="number"
      value={Number(condition.value) || 0}
      onChange={(e) => updateCondition(index, 'value', parseFloat(e.target.value) || 0)}
      placeholder="Number"
    />
  )
}

export default RuleInputNumber