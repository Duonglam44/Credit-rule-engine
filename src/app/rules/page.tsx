"use client"

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit2, Trash2, AlertCircle, Settings } from "lucide-react"
import { RuleForm } from "./components/RuleForm"
import { LoadingSpinner, TableSkeleton } from "@/components/ui/loading-spinner"
import { RuleWithOutcome } from "@/types/rules"

export default function RulesPage() {
  const [rules, setRules] = useState<RuleWithOutcome[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingRule, setEditingRule] = useState<RuleWithOutcome | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchRules()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchRules = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/rules')
      if (!response.ok) {
        throw new Error('Failed to fetch rules')
      }
      const data = await response.json()
      setRules(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleRuleSaved = () => {
    setShowForm(false)
    setEditingRule(null)
    fetchRules()
  }

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Are you sure you want to delete this rule?')) {
      return
    }

    try {
      setDeleteLoading(id)
      const response = await fetch(`/api/rules/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete rule')
      }

      fetchRules()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete rule')
    } finally {
      setDeleteLoading(null)
    }
  }, [fetchRules])

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {editingRule ? 'Edit Rule' : 'Create Rule'}
            </h1>
            <p className="text-muted-foreground">
              {editingRule ? 'Update the rule configuration below.' : 'Create a new business rule for credit evaluation.'}
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => {
              setShowForm(false)
              setEditingRule(null)
            }}
          >
            Back to Rules
          </Button>
        </div>

        <div className="flex justify-center">
          <RuleForm
            rule={editingRule}
            onSaved={handleRuleSaved}
            onCancel={() => {
              setShowForm(false)
              setEditingRule(null)
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Rules</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Create and manage business rules that determine credit approval outcomes.
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Rule
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Business Rules</CardTitle>
          <CardDescription>
            Rules that define the logic for credit approval decisions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <TableSkeleton rows={5} />
          ) : rules.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="mx-auto max-w-sm">
                <div className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-3 sm:mb-4">
                  <Settings className="h-full w-full" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-2">No rules found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create your first business rule to start automating credit decisions.
                </p>
                <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Rule
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">Name</TableHead>
                    <TableHead className="min-w-[120px] hidden sm:table-cell">Event ID</TableHead>
                    <TableHead className="min-w-[100px]">Outcome</TableHead>
                    <TableHead className="min-w-[80px] hidden md:table-cell">Status</TableHead>
                    <TableHead className="text-right min-w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">
                        <div className="space-y-1">
                          <div className="text-sm sm:text-base">{rule.name}</div>
                          {/* Show event ID on mobile */}
                          <div className="text-xs text-muted-foreground sm:hidden font-mono">
                            ID: {rule.event_id || '—'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm hidden sm:table-cell">
                        {rule.event_id || '—'}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant="secondary" className="text-xs">
                            {rule.outcomes?.type || 'No outcome'}
                          </Badge>
                          {/* Show status on mobile */}
                          <div className="md:hidden">
                            <Badge variant="default" className="text-xs">
                              Active
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="default" className="text-xs">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingRule(rule)
                              setShowForm(true)
                            }}
                            className="h-6 w-6 p-0 sm:h-8 sm:w-8"
                          >
                            <Edit2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(rule.id!)}
                            disabled={deleteLoading === rule.id}
                            className="h-6 w-6 p-0 sm:h-8 sm:w-8 hover:bg-destructive hover:text-white"
                          >
                            {deleteLoading === rule.id ? (
                              <LoadingSpinner size="sm" />
                            ) : (
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
