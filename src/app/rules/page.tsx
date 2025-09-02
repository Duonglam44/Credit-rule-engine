"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Play } from "lucide-react"
import { RuleForm } from "@/app/rules/components/RuleForm"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { RuleWithOutcome } from '@/types/rules'

export default function RulesPage() {
  const [rules, setRules] = useState<RuleWithOutcome[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingRule, setEditingRule] = useState<RuleWithOutcome | null>(null)
  const [showForm, setShowForm] = useState(false)

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
      const response = await fetch(`/api/rules/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete rule')
      }

      fetchRules()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete rule')
    }
  }, [fetchRules])

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Rules Management</h1>
          <p className="text-muted-foreground">
            Create and configure business rules for credit approvals
          </p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingRule(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="!max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingRule ? 'Edit Rule' : 'Create New Rule'}
              </DialogTitle>
            </DialogHeader>
            <RuleForm
              rule={editingRule}
              onSaved={handleRuleSaved}
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
          <CardTitle>Available Rules</CardTitle>
          <CardDescription>
            Rules define the business logic for credit approvals
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rules.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No rules found. Create your first rule to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Outcome Type</TableHead>
                  <TableHead>Conditions</TableHead>
                  <TableHead className="w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">{rule.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {rule.outcomes.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <pre className="text-xs bg-gray-50 p-2 rounded max-w-md overflow-auto">
                        {JSON.stringify(rule.json_conditions, null, 2)}
                      </pre>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                        >
                          <Link href={`/test-engine?rule=${rule.id}`}>
                            <Play className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingRule(rule)
                            setShowForm(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => rule.id && handleDelete(rule.id)}
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
