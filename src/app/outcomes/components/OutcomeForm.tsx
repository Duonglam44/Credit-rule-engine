"use client"

import { useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Outcome } from "@/schemas/outcome"

interface OutcomeFormProps {
  outcome?: Outcome | null
  onSaved: () => void
  onCancel: () => void
}

export function OutcomeForm({ outcome, onSaved, onCancel }: OutcomeFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paramsJson, setParamsJson] = useState(
    outcome?.params ? JSON.stringify(outcome.params, null, 2) : "{}"
  )

  const form = useForm({
    defaultValues: {
      type: outcome?.type || "",
    },
  })

  const handleSubmit = useCallback(async (data: { type: string }) => {
    try {
      setLoading(true)
      setError(null)

      let parsedParams
      try {
        parsedParams = JSON.parse(paramsJson)
      } catch {
        throw new Error("Invalid JSON format in parameters")
      }

      const payload = {
        ...data,
        params: parsedParams,
      }

      const url = outcome?.id ? `/api/outcomes/${outcome.id}` : "/api/outcomes"
      const method = outcome?.id ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save outcome")
      }

      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }, [onSaved, outcome?.id, paramsJson])

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{outcome ? "Edit Outcome" : "Create New Outcome"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Input
              id="type"
              placeholder="e.g., credit_approved"
              {...form.register("type")}
            />
            {form.formState.errors.type && (
              <p className="text-sm text-red-600">{form.formState.errors.type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="params">Parameters (JSON)</Label>
            <Textarea
              id="params"
              placeholder='{"message": "Credit approved", "limit": 10000}'
              value={paramsJson}
              onChange={(e) => setParamsJson(e.target.value)}
              rows={6}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Enter valid JSON for outcome parameters
            </p>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Saving..." : outcome ? "Update" : "Create"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
