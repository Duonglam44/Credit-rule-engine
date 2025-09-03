"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { Fact, factSchema, FactType } from "@/schemas/fact"

interface FactFormProps {
  fact?: Fact | null
  onSaved: () => void
  onCancel: () => void
}

export function FactForm({ fact, onSaved, onCancel }: FactFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [options, setOptions] = useState<string[]>(fact?.options || [])
  const [newOption, setNewOption] = useState("")

  const form = useForm<Fact>({
    resolver: zodResolver(factSchema),
    defaultValues: {
      name: fact?.name || "",
      description: fact?.description || "",
      type: fact?.type || FactType.STRING,
      options: fact?.options || [],
    },
  })

  const watchedType = form.watch("type")

  const handleSubmit = async (data: Fact) => {
    try {
      setLoading(true)
      setError(null)

      const payload = {
        ...data,
        options: watchedType === FactType.LIST ? options : undefined,
      }

      const url = fact?.id ? `/api/facts/${fact.id}` : "/api/facts"
      const method = fact?.id ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save fact")
      }

      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const addOption = () => {
    if (newOption.trim() && !options.includes(newOption.trim())) {
      const newOptions = [...options, newOption.trim()]
      form.setValue("options", newOptions)
      setOptions(newOptions)
      setNewOption("")
    }
  }

  const removeOption = (optionToRemove: string) => {
    setOptions(options.filter(option => option !== optionToRemove))
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{fact ? "Edit Fact" : "Create New Fact"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="e.g., creditScore"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what this fact represents"
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-600">{form.formState.errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={form.watch("type")}
              onValueChange={(value) => form.setValue("type", value as Fact["type"])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select fact type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="string">String</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="boolean">Boolean</SelectItem>
                <SelectItem value="list">List</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.type && (
              <p className="text-sm text-red-600">{form.formState.errors.type.message}</p>
            )}
          </div>

          {watchedType === FactType.LIST && (
            <div className="space-y-2">
              <Label>Options</Label>
              <div className="flex space-x-2">
                <Input
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  placeholder="Add an option"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addOption()
                    }
                  }}
                />
                <Button type="button" onClick={addOption} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {options.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {options.map((option) => (
                    <Badge key={option} variant="secondary" className="flex items-center gap-1">
                      {option}
                      <button
                        type="button"
                        onClick={() => removeOption(option)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              {watchedType === FactType.LIST && options.length === 0 && (
                <p className="text-sm text-red-600">Options are required for list type facts</p>
              )}
              {form.formState.errors.options && (
                <p className="text-sm text-red-600">{form.formState.errors.options.message}</p>
              )}
            </div>
          )}

          <div className="flex space-x-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Saving..." : fact ? "Update" : "Create"}
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
