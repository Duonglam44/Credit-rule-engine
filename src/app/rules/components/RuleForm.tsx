"use client"

import { useState, useEffect, JSX } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"
import RuleInputNumber from './RuleInputNumber'
import { Json } from '@/lib/database.types'
import RuleInputBoolean from './RuleInputBoolean'
import RuleInputList from './RuleInputList'
import RuleInputText from './RuleInputText'
import { Fact, FactType, getOperatorsForFactType } from '@/schemas/fact'
import { Outcome } from '@/schemas/outcome'
import { Condition, RuleWithOutcome } from '@/types/rules'

interface RuleFormProps {
  rule?: RuleWithOutcome | null
  onSaved: () => void
  onCancel: () => void
}

export function RuleForm({ rule, onSaved, onCancel }: RuleFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [facts, setFacts] = useState<Fact[]>([])
  const [outcomes, setOutcomes] = useState<Outcome[]>([])
  const [conditions, setConditions] = useState<Condition[]>([])
  const [logicType, setLogicType] = useState<'all' | 'any'>('all')

  const form = useForm({
    defaultValues: {
      name: rule?.name || "",
      event_id: rule?.event_id || "",
    },
  })

  useEffect(() => {
    fetchFacts()
    fetchOutcomes()

    if (rule?.json_conditions) {
      const conditionsData = rule.json_conditions as { all?: Condition[], any?: Condition[] }
      if (conditionsData.all) {
        setConditions(conditionsData.all)
        setLogicType('all')
      } else if (conditionsData.any) {
        setConditions(conditionsData.any)
        setLogicType('any')
      }
    }
  }, [rule])

  const fetchFacts = async () => {
    try {
      const response = await fetch('/api/facts')
      if (response.ok) {
        const data = await response.json()
        setFacts(data)
      }
    } catch (err) {
      console.error('Failed to fetch facts:', err)
    }
  }

  const fetchOutcomes = async () => {
    try {
      const response = await fetch('/api/outcomes')
      if (response.ok) {
        const data = await response.json()
        setOutcomes(data)
      }
    } catch (err) {
      console.error('Failed to fetch outcomes:', err)
    }
  }

  const addCondition = () => {
    setConditions([...conditions, { fact: '', operator: '', value: '' }])
  }

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index))
  }

  const updateCondition = (index: number, field: keyof Condition, value: unknown) => {
    const updated = [...conditions]
    updated[index] = { ...updated[index], [field]: value }
    
    if (field === 'fact') {
      updated[index] = { ...updated[index], operator: '', value: '' }
    }
    else if (field === 'operator') {
      updated[index] = { ...updated[index], value: '' }
    }
    
    setConditions(updated)
  }

  const getFactByName = (name: string) => {
    return facts.find(f => f.name === name)
  }

  const handleSubmit = async (data: { name: string; event_id: string }) => {
    try {
      setLoading(true)
      setError(null)

      if (conditions.length === 0) {
        throw new Error("At least one condition is required")
      }

      // Validate each condition
      for (let i = 0; i < conditions.length; i++) {
        const condition = conditions[i]
        
        if (!condition.fact || condition.fact.trim() === '') {
          throw new Error(`Condition ${i + 1}: Please select a fact`)
        }
        
        if (!condition.operator || condition.operator.trim() === '') {
          throw new Error(`Condition ${i + 1}: Please select an operator`)
        }
        
        if (condition.value === '' || condition.value === null || condition.value === undefined) {
          throw new Error(`Condition ${i + 1}: Please provide a value`)
        }
      }

      const payload = {
        ...data,
        json_conditions: {
          [logicType]: conditions
        }
      }

      const url = rule?.id ? `/api/rules/${rule.id}` : "/api/rules"
      const method = rule?.id ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save rule")
      }

      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-[900px]">
      <CardHeader>
        <CardTitle>{rule ? "Edit Rule" : "Create New Rule"}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Rule Name</Label>
            <Input
              id="name"
              placeholder="e.g., Standard Credit Approval"
              {...form.register("name")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event_id">Outcome</Label>
            <Select
              value={form.watch("event_id")}
              onValueChange={(value) => form.setValue("event_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select outcome" />
              </SelectTrigger>
              <SelectContent>
                {outcomes.map((outcome) => (
                  <SelectItem key={outcome.id} value={outcome.id!}>
                    {outcome.type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Conditions</Label>
              <div className="flex items-center gap-2">
                <Label className="text-sm">Logic:</Label>
                <Select value={logicType} onValueChange={(value) => setLogicType(value as 'all' | 'any')}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ALL</SelectItem>
                    <SelectItem value="any">ANY</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {conditions.map((condition, index) => (
              <div key={index} className="space-y-2">
                <div className="flex gap-2 items-center">
                  <Select
                    value={condition.fact}
                    onValueChange={(value) => updateCondition(index, 'fact', value)}
                  >
                    <SelectTrigger className={`w-[30%] max-w-[30%] ${!condition.fact ? 'border-red-300' : ''}`}>
                      <SelectValue placeholder="Select fact" />
                    </SelectTrigger>
                    <SelectContent>
                      {facts.map((fact) => (
                        <SelectItem key={fact.name} value={fact.name}>
                          <div className="flex items-center gap-2">
                            {fact.name}
                            <Badge variant="outline" className="text-xs">
                              {fact.type}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={condition.operator}
                    onValueChange={(value) => updateCondition(index, 'operator', value)}
                    disabled={!condition.fact}
                  >
                    <SelectTrigger className={`w-[30%] max-w-[30%] ${condition.fact && !condition.operator ? 'border-red-300' : ''}`}>
                      <SelectValue placeholder="Select operator" />
                    </SelectTrigger>
                    <SelectContent>
                      {condition.fact && getFactByName(condition.fact) &&
                        getOperatorsForFactType(getFactByName(condition.fact)!.type).map((operator) => (
                          <SelectItem key={operator} value={operator}>
                            {operator}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>

                  <div className="w-[30%]">
                    {condition.fact && getFactByName(condition.fact) ? (
                      <RuleInput 
                        fact={getFactByName(condition.fact)!} 
                        condition={condition} 
                        index={index} 
                        updateCondition={updateCondition} 
                      />
                    ) : (
                      <div className="h-10 border border-dashed border-gray-300 rounded-md flex items-center justify-center text-sm text-muted-foreground">
                        Select fact first
                      </div>
                    )}
                  </div>

                  <Button
                    className="w-[10%]"
                    size="sm"
                    type="button"
                    variant="ghost"
                    onClick={() => removeCondition(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Validation hints */}
                <div className="text-xs text-muted-foreground ml-1">
                  {!condition.fact && "Please select a fact"}
                  {condition.fact && !condition.operator && "Please select an operator"}
                  {condition.fact && condition.operator && (condition.value === '' || condition.value === null || condition.value === undefined) && "Please provide a value"}
                </div>
              </div>
            ))}

            <Button type="button" variant="outline" onClick={addCondition}>
              <Plus className="h-4 w-4 mr-2" />
              Add Condition
            </Button>

            {conditions.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Add at least one condition to create a rule
              </p>
            )}
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Saving..." : rule ? "Update" : "Create"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
        </CardDescription>
      </CardContent>
    </Card>
  )
}

type RuleInputProps = {
  fact: Fact;
  condition: Condition;
  index: number;
  updateCondition: (index: number, field: 'fact' | 'operator' | 'value', value: Json) => void;
}

function RuleInput(props: RuleInputProps) {
  const { fact, index, updateCondition, condition } = props

  const ruleInputs: Record<string, JSX.Element> = {
    [FactType.NUMBER]: <RuleInputNumber key="fact-input-number" index={index} updateCondition={updateCondition} condition={condition} />,
    [FactType.BOOLEAN]: <RuleInputBoolean key="fact-input-boolean" index={index} updateCondition={updateCondition} condition={condition} />,
    [FactType.LIST]: <RuleInputList key="fact-input-list" index={index} updateCondition={updateCondition} condition={condition} fact={fact} />,
    [FactType.STRING]: <RuleInputText key="fact-input-string" index={index} updateCondition={updateCondition} condition={condition} />,
  }

  return ruleInputs[fact?.type || FactType.STRING]
}