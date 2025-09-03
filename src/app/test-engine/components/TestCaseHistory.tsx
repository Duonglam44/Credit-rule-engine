"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PlayCircle, Eye, Trash2, CheckCircle, XCircle, Calendar } from "lucide-react"
import { TestCase } from '@/types/testCase'

interface TestCaseHistoryProps {
  onError: (error: string) => void
}

export default function TestCaseHistory({ onError }: TestCaseHistoryProps) {
  const [testCases, setTestCases] = useState<TestCase[]>([])
  const [testCasesLoading, setTestCasesLoading] = useState(false)
  const [runningTestCase, setRunningTestCase] = useState<string | null>(null)

  const fetchTestCases = useCallback(async () => {
    try {
      setTestCasesLoading(true)
      const response = await fetch('/api/test-cases')
      if (!response.ok) {
        throw new Error('Failed to fetch test cases')
      }
      const data = await response.json()
      setTestCases(data)
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to load test cases')
    } finally {
      setTestCasesLoading(false)
    }
  }, [onError])

  const runTestCase = useCallback(async (testCaseId: string, ruleId: string, inputFacts: Record<string, unknown>) => {
    try {
      setRunningTestCase(testCaseId)
      onError('')

      const response = await fetch('/api/engine/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ruleId,
          factInputs: inputFacts
        })
      })

      if (!response.ok) {
        throw new Error('Failed to run test case')
      }

      const result = await response.json()

      const updateResponse = await fetch(`/api/test-cases/${testCaseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          actual_output: result
        })
      })

      if (!updateResponse.ok) {
        throw new Error('Failed to update test case')
      }

      fetchTestCases()
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to run test case')
    } finally {
      setRunningTestCase(null)
    }
  }, [fetchTestCases, onError])

  const deleteTestCase = useCallback(async (testCaseId: string) => {
    if (!confirm('Are you sure you want to delete this test case?')) {
      return
    }

    try {
      const response = await fetch(`/api/test-cases/${testCaseId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete test case')
      }

      fetchTestCases()
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to delete test case')
    }
  }, [fetchTestCases, onError])

  const getTestStatus = (testCase: TestCase) => {
    if (!testCase.actual_output) {
      return { status: 'not-run', label: 'Not Run', variant: 'secondary' as const }
    }

    const expected = JSON.stringify(testCase.expected_output)
    const actual = JSON.stringify(testCase.actual_output)
    
    if (expected === actual) {
      return { status: 'passed', label: 'Passed', variant: 'default' as const }
    } else {
      return { status: 'failed', label: 'Failed', variant: 'destructive' as const }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  useEffect(() => {
    fetchTestCases()
  }, [fetchTestCases])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Case History</CardTitle>
        <CardDescription>
          View and manage all test cases created for your rules
        </CardDescription>
      </CardHeader>
      <CardContent>
        {testCasesLoading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
            <span className="ml-2 text-muted-foreground">Loading test cases...</span>
          </div>
        ) : testCases.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto max-w-sm">
              <div className="mx-auto h-12 w-12 text-muted-foreground mb-4">
                <Calendar className="h-12 w-12" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No test cases found</h3>
              <p className="text-muted-foreground mb-4">
                No test cases have been created yet. Create and save test cases from the &quot;Run Test&quot; tab.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Rule</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="min-w-[120px] hidden md:table-cell">Created</TableHead>
                  <TableHead className="min-w-[120px] hidden lg:table-cell">Last Run</TableHead>
                  <TableHead className="text-right min-w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testCases.map((testCase) => {
                  const status = getTestStatus(testCase)
                  return (
                    <TableRow key={testCase.id}>
                      <TableCell className="font-medium">
                        <div className="space-y-1">
                          <div className="text-sm sm:text-base">
                            {testCase.rules?.name || 'Unknown Rule'}
                          </div>
                          <div className="text-xs text-muted-foreground md:hidden">
                            Created: {formatDate(testCase.created_at)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant={status.variant} className="text-xs">
                            {status.status === 'passed' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {status.status === 'failed' && <XCircle className="h-3 w-3 mr-1" />}
                            {status.label}
                          </Badge>
                          {testCase.actual_output && (
                            <div className="text-xs text-muted-foreground lg:hidden">
                              Last run: {formatDate(testCase.updated_at)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {formatDate(testCase.created_at)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        {testCase.actual_output ? formatDate(testCase.updated_at) : 'Never'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 sm:h-8 sm:w-8">
                                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Test Case Details</DialogTitle>
                                <DialogDescription>
                                  Detailed view of test case for {testCase.rules?.name}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium mb-2">Input Facts:</h4>
                                  <pre className="text-xs bg-muted p-3 rounded-lg overflow-auto font-mono">
                                    {JSON.stringify(testCase.input_facts, null, 2)}
                                  </pre>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Expected Output:</h4>
                                  <pre className="text-xs bg-muted p-3 rounded-lg overflow-auto font-mono">
                                    {JSON.stringify(testCase.expected_output, null, 2)}
                                  </pre>
                                </div>
                                {testCase.actual_output && (
                                  <div>
                                    <h4 className="font-medium mb-2">Actual Output:</h4>
                                    <pre className="text-xs bg-muted p-3 rounded-lg overflow-auto font-mono">
                                      {JSON.stringify(testCase.actual_output, null, 2)}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => runTestCase(testCase.id, testCase.rule_id, testCase.input_facts)}
                            disabled={runningTestCase === testCase.id}
                            className="h-6 w-6 p-0 sm:h-8 sm:w-8"
                          >
                            {runningTestCase === testCase.id ? (
                              <LoadingSpinner size="sm" />
                            ) : (
                              <PlayCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTestCase(testCase.id)}
                            className="h-6 w-6 p-0 sm:h-8 sm:w-8 hover:bg-destructive hover:text-white"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
