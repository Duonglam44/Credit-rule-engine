import { Input } from '@/components/ui/input'
import { Json } from '@/lib/database.types'
import { Condition } from '@/types/rules'
import React from 'react'

type RuleInputTextProps = {
  condition: Condition
  index: number
  updateCondition: (index: number, field: 'fact' | 'operator' | 'value', value: Json) => void
}


const RuleInputText = (props: RuleInputTextProps) => {
  const { condition, index, updateCondition } = props

  return (
    <Input
      value={condition.value as string || ''}
      onChange={(e) => updateCondition(index, 'value', e.target.value)}
      placeholder="Value"
    />
  )
}

export default RuleInputText