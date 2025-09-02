export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      facts: {
        Row: {
          created_at: string
          description: string | null
          id: string
          json_definition: Json | null
          name: string
          options: string[] | null
          type: "number" | "string" | "boolean" | "list" | "function"
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          json_definition?: Json | null
          name: string
          options?: string[] | null
          type: "number" | "string" | "boolean" | "list" | "function"
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          json_definition?: Json | null
          name?: string
          options?: string[] | null
          type?: "number" | "string" | "boolean" | "list" | "function"
          updated_at?: string
        }
        Relationships: []
      }
      outcomes: {
        Row: {
          created_at: string
          id: string
          params: Json
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          params: Json
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          params?: Json
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      rules: {
        Row: {
          created_at: string
          event_id: string
          id: string
          json_conditions: Json
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          json_conditions: Json
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          json_conditions?: Json
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      test_cases: {
        Row: {
          actual_output: Json | null
          created_at: string
          expected_output: Json | null
          id: string
          input_facts: Json
          rule_id: string
          updated_at: string
        }
        Insert: {
          actual_output?: Json | null
          created_at?: string
          expected_output?: Json | null
          id?: string
          input_facts: Json
          rule_id: string
          updated_at?: string
        }
        Update: {
          actual_output?: Json | null
          created_at?: string
          expected_output?: Json | null
          id?: string
          input_facts?: Json
          rule_id?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<never, never>
    Functions: Record<never, never>
    Enums: Record<never, never>
    CompositeTypes: Record<never, never>
  }
}
