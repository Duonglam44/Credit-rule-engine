"use client"

import { useState, useEffect, JSX, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlayCircle, Save, RotateCcw } from "lucide-react"
import { Fact, FactType } from "@/schemas/fact"
import TestEngineNumber from './components/TestEngineNumber'
import TestEngineList from './components/TestEngineList'
import TestEngineText from './components/TestEngineText'
import TestEngineBoolean from './components/TestEngineBoolean'
import TestCaseHistory from './components/TestCaseHistory'
import { TestResult, TestRule } from '@/types/test'
import { Json } from '@/lib/database.types'

export default function TestEnginePage() {
  const [rules, setRules] = useState<TestRule[]>([])
  const [selectedRuleId, setSelectedRuleId] = useState<string>("")
  const [ruleFacts, setRuleFacts] = useState<Fact[]>([])
  const [factInputs, setFactInputs] = useState<Record<string, unknown>>({})
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [factsLoading, setFactsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRules()
  }, [])

  useEffect(() => {
    if (selectedRuleId) {
      fetchRuleFacts(selectedRuleId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRuleId])

  const fetchRules = async () => {
    try {
      const response = await fetch('/api/rules')
      if (!response.ok) {
        throw new Error('Failed to fetch rules')
      }
      const data = await response.json()
      setRules(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const fetchRuleFacts = useCallback(async (ruleId: string) => {
    try {
      setFactsLoading(true)
      setError(null)
      const response = await fetch(`/api/engine/facts/${ruleId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch rule facts')
      }
      const data = await response.json()
      setRuleFacts(data)

      const initialInputs: Record<string, Json> = {}
      data.forEach((fact: Fact) => {
        const defaultValues: Record<string, Json> = {
          [FactType.NUMBER]: 0,
          [FactType.STRING]: "",
          [FactType.BOOLEAN]: false,
          [FactType.LIST]: fact.options?.[0] || "",
        }

        initialInputs[fact.name] = defaultValues[fact.type || FactType.STRING] ?? ""
      })
      setFactInputs(initialInputs)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setFactsLoading(false)
    }
  }, [])

  const runTest = useCallback(async () => {
    if (!selectedRuleId) {
      setError("Please select a rule first")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/engine/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ruleId: selectedRuleId,
          factInputs
        })
      })

      if (!response.ok) {
        throw new Error('Failed to run test')
      }

      const result = await response.json()
      setTestResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [factInputs, selectedRuleId])

  const saveTestCase = useCallback(async () => {
    if (!selectedRuleId || !testResult) {
      return
    }

    try {
      const response = await fetch('/api/test-cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rule_id: selectedRuleId,
          input_facts: factInputs,
          expected_output: testResult
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save test case')
      }

      alert('Test case saved successfully!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save test case')
    }
  }, [factInputs, selectedRuleId, testResult])

  const resetForm = () => {
    setTestResult(null)
    setError(null)
    if (selectedRuleId) {
      fetchRuleFacts(selectedRuleId)
    }
  }

  const updateFactInput = useCallback((factName: string, value: unknown) => {
    setFactInputs(prev => ({
      ...prev,
      [factName]: value
    }))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Test Engine</h1>
        <p className="text-muted-foreground">
          Test rules with sample data and validate outcomes
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="test" className="space-y-6">
        <TabsList>
          <TabsTrigger value="test">Run Test</TabsTrigger>
          <TabsTrigger value="history">Test History</TabsTrigger>
        </TabsList>

        <TabsContent value="test" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Rule</CardTitle>
              <CardDescription>
                Choose a rule to test from your configured rules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedRuleId} onValueChange={setSelectedRuleId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a rule to test" />
                </SelectTrigger>
                <SelectContent>
                  {rules.map((rule) => (
                    <SelectItem key={rule.id} value={rule.id}>
                      {rule.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedRuleId && (
            <Card>
              <CardHeader>
                <CardTitle>Configure Test Data</CardTitle>
                <CardDescription>
                  Provide values for the facts used by this rule
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {factsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <LoadingSpinner />
                    <span className="ml-2 text-muted-foreground">Loading facts...</span>
                  </div>
                ) : ruleFacts.length > 0 ? (
                  <>
                    {ruleFacts.map((fact) => (
                      <div key={fact.name} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={fact.name}>{fact.name}</Label>
                          <Badge variant="outline">{fact.type}</Badge>
                        </div>
                        {fact.description && (
                          <p className="text-sm text-muted-foreground">{fact.description}</p>
                        )}
                        <EngineFactInput fact={fact} factInputs={factInputs} onChange={updateFactInput} />
                      </div>
                    ))}

                    <div className="flex gap-2 pt-4">
                      <Button onClick={runTest} disabled={loading}>
                        <PlayCircle className="h-4 w-4 mr-2" />
                        {loading ? "Running..." : "Run Test"}
                      </Button>
                      <Button variant="outline" onClick={resetForm}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No facts found for this rule
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {testResult && (
            <Card>
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
                <CardDescription>
                  Results from the last rule execution
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant={testResult.success ? "default" : "destructive"}>
                    {testResult.success ? "Success" : "Failed"}
                  </Badge>
                </div>

                {testResult.success && testResult.events && testResult.events.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-medium">Triggered Events:</h3>
                    {testResult.events.map((event, index) => (
                      <div key={index} className="bg-muted p-3 rounded-lg">
                        <div className="font-medium text-sm">{event.type}</div>
                        <pre className="text-xs mt-1 text-muted-foreground font-mono">
                          {JSON.stringify(event.params, null, 2)}
                        </pre>
                      </div>
                    ))}
                  </div>
                )}

                {testResult.error && (
                  <Alert variant="destructive">
                    <AlertDescription>{testResult.error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <h3 className="font-medium">Input Facts:</h3>
                  <pre className="text-xs bg-muted p-3 rounded-lg overflow-auto font-mono">
                    {JSON.stringify(testResult.facts, null, 2)}
                  </pre>
                </div>

                {testResult.success && (
                  <Button onClick={saveTestCase}>
                    <Save className="h-4 w-4 mr-2" />
                    Save as Test Case
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history">
          <TestCaseHistory onError={setError} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

type EngineFactInputProps = {
  fact: Fact
  factInputs: Record<string, unknown>
  onChange: (factName: string, value: unknown) => void
}

function EngineFactInput(props: EngineFactInputProps) {
  const { fact, factInputs, onChange } = props

  const engineFactInputs: Record<string, JSX.Element> = {
    [FactType.NUMBER]: <TestEngineNumber key="fact-type-number" fact={fact} factInputs={factInputs} updateFactInput={onChange} />,
    [FactType.STRING]: <TestEngineText key="fact-type-string" fact={fact} factInputs={factInputs} updateFactInput={onChange} />,
    [FactType.BOOLEAN]: <TestEngineBoolean key="fact-type-boolean" fact={fact} factInputs={factInputs} updateFactInput={onChange} />,
    [FactType.LIST]: <TestEngineList key="fact-type-list" fact={fact} factInputs={factInputs} updateFactInput={onChange} />,
  }

  return engineFactInputs[fact?.type || FactType.STRING]
}