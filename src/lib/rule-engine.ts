/* eslint-disable @typescript-eslint/no-explicit-any */
import { Engine, Rule } from 'json-rules-engine'
import { supabase } from './supabase'
import { Fact, FactType, validateFactValue } from '@/schemas/fact'
import { TestCase } from '@/schemas/testCase'

export class RuleEngineService {
  private engine: Engine

  constructor() {
    this.engine = new Engine()
  }

  async loadFacts(): Promise<Fact[]> {
    const { data, error } = await supabase
      .from('facts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to load facts: ${error.message}`)
    }

    return (data || []).map(fact => ({
      id: fact.id,
      name: fact.name,
      description: fact.description || undefined,
      type: fact.type as FactType,
      options: fact.options || undefined,
      json_definition: fact.json_definition as Record<string, unknown> || undefined
    }))
  }

  async loadRule(ruleId: string) {
    const { data: ruleData, error: ruleError } = await supabase
      .from('rules')
      .select(`
        *,
        outcomes!rules_event_id_fkey(*)
      `)
      .eq('id', ruleId)
      .single()

    if (ruleError) {
      throw new Error(`Failed to load rule: ${ruleError.message}`)
    }

    return ruleData
  }

  async validateTestEvent(factInputs: Record<string, unknown>): Promise<{
    isValid: boolean
    errors: string[]
  }> {
    const facts = await this.loadFacts()
    const errors: string[] = []

    for (const [factName, value] of Object.entries(factInputs)) {
      const fact = facts.find(f => f.name === factName)
      
      if (!fact) {
        errors.push(`Unknown fact: ${factName}`)
        continue
      }

      if (!validateFactValue(value, fact)) {
        switch (fact.type) {
          case 'number':
            errors.push(`${factName} must be a number`)
            break
          case 'string':
            errors.push(`${factName} must be a string`)
            break
          case 'boolean':
            errors.push(`${factName} must be a boolean`)
            break
          case 'list':
            errors.push(`${factName} must be one of: ${fact.options?.join(', ')}`)
            break
          default:
            errors.push(`Invalid value for ${factName}`)
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  async runRule(ruleId: string, factInputs: Record<string, unknown>) {
    try {
      const validation = await this.validateTestEvent(factInputs)
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`)
      }

      const ruleData = await this.loadRule(ruleId)

      const engine = new Engine()

      const rule = new Rule({
        conditions: ruleData.json_conditions as any,
        event: {
          type: (ruleData as any).outcomes?.type || 'default',
          params: (ruleData as any).outcomes?.params || {}
        }
      })
      
      engine.addRule(rule)

      const results = await engine.run(factInputs)

      return {
        success: true,
        events: results.events,
        facts: factInputs
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        facts: factInputs
      }
    }
  }

  async saveAndRunTestCase(testCase: Omit<TestCase, 'id' | 'actual_output'>) {
    try {
      const result = await this.runRule(testCase.rule_id, testCase.input_facts as Record<string, unknown>)
      
      const { data, error } = await supabase
        .from('test_cases')
        .insert({
          rule_id: testCase.rule_id,
          input_facts: testCase.input_facts as any,
          expected_output: testCase.expected_output as any,
          actual_output: result as any,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to save test case: ${error.message}`)
      }

      return {
        testCase: data,
        result
      }
    } catch (error) {
      throw new Error(`Failed to save and run test case: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async runAllTestCases(ruleId: string) {
    const { data: testCases, error } = await supabase
      .from('test_cases')
      .select('*')
      .eq('rule_id', ruleId)

    if (error) {
      throw new Error(`Failed to load test cases: ${error.message}`)
    }

    const results = []

    for (const testCase of testCases || []) {
      try {
        const result = await this.runRule(ruleId, testCase.input_facts as Record<string, unknown>)

        await supabase
          .from('test_cases')
          .update({ 
            actual_output: result as any,
            updated_at: new Date().toISOString()
          })
          .eq('id', testCase.id)

        results.push({
          testCase,
          result,
          passed: JSON.stringify(result) === JSON.stringify(testCase.expected_output)
        })
      } catch (error) {
        results.push({
          testCase,
          result: { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
          passed: false
        })
      }
    }

    return results
  }

  async getFactsForRule(ruleId: string): Promise<Fact[]> {
    const ruleData = await this.loadRule(ruleId)
    const allFacts = await this.loadFacts()
    
    // Extract fact names from rule conditions
    const factNames = this.extractFactNamesFromConditions(ruleData.json_conditions)
    
    return allFacts.filter(fact => factNames.includes(fact.name))
  }

  private extractFactNamesFromConditions(conditions: unknown): string[] {
    const factNames: string[] = []
    
    if (typeof conditions === 'object' && conditions !== null) {
      const conditionsObj = conditions as Record<string, unknown>
      
      if (conditionsObj.all && Array.isArray(conditionsObj.all)) {
        for (const condition of conditionsObj.all) {
          if (typeof condition === 'object' && condition !== null) {
            const conditionObj = condition as Record<string, unknown>
            if (typeof conditionObj.fact === 'string') {
              factNames.push(conditionObj.fact)
            }
          }
        }
      }
      
      if (conditionsObj.any && Array.isArray(conditionsObj.any)) {
        for (const condition of conditionsObj.any) {
          if (typeof condition === 'object' && condition !== null) {
            const conditionObj = condition as Record<string, unknown>
            if (typeof conditionObj.fact === 'string') {
              factNames.push(conditionObj.fact)
            }
          }
        }
      }
    }
    
    return [...new Set(factNames)]
  }
}

export const ruleEngineService = new RuleEngineService()
