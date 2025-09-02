"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2 } from "lucide-react"
import { OutcomeForm } from "@/app/outcomes/components/OutcomeForm"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Outcome } from "@/schemas/outcome"

export default function OutcomesPage() {
  const [outcomes, setOutcomes] = useState<Outcome[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingOutcome, setEditingOutcome] = useState<Outcome | null>(null)
  const [showForm, setShowForm] = useState(false)

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
      const response = await fetch(`/api/outcomes/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete outcome')
      }

      fetchOutcomes()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete outcome')
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Outcomes Management</h1>
          <p className="text-muted-foreground">
            Define possible outcomes and actions for rule evaluation
          </p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingOutcome(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Outcome
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingOutcome ? 'Edit Outcome' : 'Create New Outcome'}
              </DialogTitle>
            </DialogHeader>
            <OutcomeForm
              outcome={editingOutcome}
              onSaved={handleOutcomeSaved}
              onCancel={() => setShowForm(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Available Outcomes</CardTitle>
          <CardDescription>
            Outcomes define the results of rule evaluation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {outcomes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No outcomes found. Create your first outcome to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Parameters</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {outcomes.map((outcome) => (
                  <TableRow key={outcome.id}>
                    <TableCell className="font-medium">{outcome.type}</TableCell>
                    <TableCell>
                      <pre className="text-xs bg-gray-50 p-2 rounded max-w-md overflow-auto">
                        {JSON.stringify(outcome.params, null, 2)}
                      </pre>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingOutcome(outcome)
                            setShowForm(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => outcome.id && handleDelete(outcome.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
