"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit2, Trash2, AlertCircle, Target } from "lucide-react"
import { OutcomeForm } from "./components/OutcomeForm"
import { LoadingSpinner, TableSkeleton } from "@/components/ui/loading-spinner"
import { Outcome } from "@/schemas/outcome"

export default function OutcomesPage() {
  const [outcomes, setOutcomes] = useState<Outcome[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingOutcome, setEditingOutcome] = useState<Outcome | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchOutcomes()
  }, [])

  const fetchOutcomes = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/outcomes')
      if (!response.ok) {
        throw new Error('Failed to fetch outcomes')
      }
      const data = await response.json()
      setOutcomes(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleOutcomeSaved = () => {
    setShowForm(false)
    setEditingOutcome(null)
    fetchOutcomes()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this outcome?')) {
      return
    }

    try {
      setDeleteLoading(id)
      const response = await fetch(`/api/outcomes/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete outcome')
      }

      fetchOutcomes()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete outcome')
    } finally {
      setDeleteLoading(null)
    }
  }

  const getOutcomeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'rejected': 
      case 'denied': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'manual review':
      case 'review': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const formatParams = (params: Record<string, unknown>) => {
    if (!params || Object.keys(params).length === 0) return 'No parameters'
    const paramsList = Object.entries(params).slice(0, 2)
    const preview = paramsList.map(([key, value]) => `${key}: ${value}`).join(', ')
    return Object.keys(params).length > 2 ? `${preview}, +${Object.keys(params).length - 2} more` : preview
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {editingOutcome ? 'Edit Outcome' : 'Create Outcome'}
            </h1>
            <p className="text-muted-foreground">
              {editingOutcome ? 'Update the outcome configuration below.' : 'Define a new outcome for rule evaluation.'}
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => {
              setShowForm(false)
              setEditingOutcome(null)
            }}
          >
            Back to Outcomes
          </Button>
        </div>

        <div className="flex justify-center">
          <OutcomeForm
            outcome={editingOutcome}
            onSaved={handleOutcomeSaved}
            onCancel={() => {
              setShowForm(false)
              setEditingOutcome(null)
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Outcomes</h1>
          <p className="text-muted-foreground">
            Define possible results and actions for rule evaluation.
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Outcome
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
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Available Outcomes
          </CardTitle>
          <CardDescription>
            Outcomes define the possible results when rules are evaluated. Each outcome has a type and optional parameters.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <TableSkeleton rows={5} />
          ) : outcomes.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto max-w-sm">
                <div className="mx-auto h-12 w-12 text-muted-foreground mb-4">
                  <Target className="h-12 w-12" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No outcomes configured</h3>
                <p className="text-muted-foreground mb-4">
                  Define outcomes like &quot;Approved&quot;, &quot;Rejected&quot;, or &quot;Manual Review&quot; to complete your rule engine.
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Outcome
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead className="hidden md:table-cell">Parameters</TableHead>
                    <TableHead className="hidden sm:table-cell">Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {outcomes.map((outcome) => (
                    <TableRow key={outcome.id}>
                      <TableCell>
                        <Badge variant="outline" className={getOutcomeColor(outcome.type)}>
                          {outcome.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-xs">
                        <span className="text-sm text-muted-foreground truncate block">
                          {formatParams(outcome.params || {})}
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="text-sm text-muted-foreground">
                          {outcome.created_at ? new Date(outcome.created_at).toLocaleDateString() : '-'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingOutcome(outcome)
                              setShowForm(true)
                            }}
                          >
                            <Edit2 className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(outcome.id!)}
                            disabled={deleteLoading === outcome.id}
                            className="h-8 w-8 p-0 hover:bg-destructive hover:text-white"
                          >
                            {deleteLoading === outcome.id ? (
                              <LoadingSpinner size="sm" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                            <span className="sr-only">Delete</span>
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
