import React from 'react'
import { Json } from "@/lib/database.types"
import { Condition } from '@/types/rules'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'


type RuleInputBooleanProps = {
  condition: Condition
  index: number
  updateCondition: (index: number, field: 'fact' | 'operator' | 'value', value: Json) => void
}

const RuleInputBoolean = (props: RuleInputBooleanProps) => {
  const { condition, index, updateCondition } = props
  return (
    <Select
      value={condition.value?.toString() || 'false'}
      onValueChange={(value) => updateCondition(index, 'value', value === 'true')}
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

export default RuleInputBoolean