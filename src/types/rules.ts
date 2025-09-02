import { Rule } from '@/schemas/rule'

export interface RuleCondition {
  fact: string
  operator: string
  value: unknown
}

export interface RuleConditions {
  all?: RuleCondition[]
  any?: RuleCondition[]
}

export interface RuleEvent {
  type: string
  params?: Record<string, unknown>
}

export interface JsonRule {
  conditions: RuleConditions
  event: RuleEvent
}

export interface RuleWithOutcome extends Rule {
  outcomes: {
    type: string
    params: Record<string, unknown>
  }
}

export interface Condition {
  fact: string
  operator: string
  value: unknown
}