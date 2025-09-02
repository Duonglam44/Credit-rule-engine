"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"
import { FactForm } from "@/app/facts/components/FactForm"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Fact } from "@/schemas/fact"

export default function FactsPage() {
  const [facts, setFacts] = useState<Fact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingFact, setEditingFact] = useState<Fact | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchFacts()
  }, [])

  const fetchFacts = async () => {
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
  }

  const handleFactSaved = () => {
    setShowForm(false)
    setEditingFact(null)
    fetchFacts()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this fact?')) {
      return
    }

    try {
      const response = await fetch(`/api/facts/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete fact')
      }

      fetchFacts()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete fact')
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'number': return 'bg-blue-100 text-blue-800'
      case 'string': return 'bg-green-100 text-green-800'
      case 'boolean': return 'bg-yellow-100 text-yellow-800'
      case 'list': return 'bg-purple-100 text-purple-800'
      case 'function': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Facts Management</h1>
          <p className="text-muted-foreground">
            Manage data types and validation rules for credit assessment
          </p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingFact(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Fact
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingFact ? 'Edit Fact' : 'Create New Fact'}
              </DialogTitle>
            </DialogHeader>
            <FactForm
              fact={editingFact}
              onSaved={handleFactSaved}
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
          <CardTitle>Available Facts</CardTitle>
          <CardDescription>
            Facts are the data elements used in rule evaluation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {facts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No facts found. Create your first fact to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Options</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {facts.map((fact) => (
                  <TableRow key={fact.id}>
                    <TableCell className="font-medium">{fact.name}</TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(fact.type)}>
                        {fact.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{fact.description}</TableCell>
                    <TableCell>
                      {fact.type === 'list' && fact.options ? (
                        <div className="flex flex-wrap gap-1">
                          {fact.options.map((option) => (
                            <Badge key={option} variant="outline" className="text-xs">
                              {option}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingFact(fact)
                            setShowForm(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => fact.id && handleDelete(fact.id)}
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
