"use client"

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit2, Trash2, AlertCircle } from "lucide-react"
import { FactForm } from "./components/FactForm"
import { LoadingSpinner, TableSkeleton } from "@/components/ui/loading-spinner"
import { Fact } from "@/schemas/fact"

export default function FactsPage() {
  const [facts, setFacts] = useState<Fact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingFact, setEditingFact] = useState<Fact | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)


  const fetchFacts = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/facts')
      if (!response.ok) {
        throw new Error('Failed to fetch facts')
      }
      const data = await response.json()
      setFacts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFacts()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFactSaved = () => {
    setShowForm(false)
    setEditingFact(null)
    fetchFacts()
  }

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Are you sure you want to delete this fact?')) {
      return
    }

    try {
      setDeleteLoading(id)
      const response = await fetch(`/api/facts/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete fact')
      }

      fetchFacts()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete fact')
    } finally {
      setDeleteLoading(null)
    }
  }, [])

  const getTypeColor = useCallback((type: string) => {
    switch (type) {
      case 'number': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'string': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'boolean': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'list': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }, [])

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {editingFact ? 'Edit Fact' : 'Create Fact'}
            </h1>
            <p className="text-muted-foreground">
              {editingFact ? 'Update the fact details below.' : 'Define a new data type for your rules.'}
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => {
              setShowForm(false)
              setEditingFact(null)
            }}
          >
            Back to Facts
          </Button>
        </div>

        <div className="flex justify-center">
          <FactForm
            fact={editingFact}
            onSaved={handleFactSaved}
            onCancel={() => {
              setShowForm(false)
              setEditingFact(null)
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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Facts</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage data types and validation rules for your credit assessment engine.
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Fact
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
          <CardTitle>Available Facts</CardTitle>
          <CardDescription>
            Facts define the data types used in your business rules. Each fact has a name, type, and optional validation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <TableSkeleton rows={5} />
          ) : facts.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto max-w-sm">
                <div className="mx-auto h-12 w-12 text-muted-foreground mb-4">
                  <AlertCircle className="h-12 w-12" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No facts found</h3>
                <p className="text-muted-foreground mb-4">
                  Get started by creating your first fact to define data types for your rules.
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Fact
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden sm:table-cell">Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="hidden md:table-cell">Options</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {facts.map((fact) => (
                    <TableRow key={fact.id}>
                      <TableCell className="font-medium">{fact.name}</TableCell>
                      <TableCell className="hidden sm:table-cell max-w-xs truncate">
                        {fact.description}
                      </TableCell>
                      <TableCell>
                        <Badge variant="default" className={getTypeColor(fact.type)}>
                          {fact.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {fact.options && fact.options.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {fact.options.slice(0, 2).map((option) => (
                              <Badge key={option} variant="secondary" className="text-xs">
                                {option}
                              </Badge>
                            ))}
                            {fact.options.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{fact.options.length - 2} more
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingFact(fact)
                              setShowForm(true)
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Edit2 className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(fact.id!)}
                            disabled={deleteLoading === fact.id}
                            className="h-8 w-8 p-0 hover:bg-destructive hover:text-white"
                          >
                            {deleteLoading === fact.id ? (
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
