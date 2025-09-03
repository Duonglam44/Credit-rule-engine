import { z } from 'zod'

export enum FactType {
  NUMBER = 'number',
  STRING = 'string',
  BOOLEAN = 'boolean',
  LIST = 'list',
}

export enum Operator {
  EQUAL = 'equal',
  NOT_EQUAL = 'notEqual',
  GREATER_THAN = 'greaterThan',
  GREATER_THAN_INCLUSIVE = 'greaterThanInclusive',
  LESS_THAN = 'lessThan',
  LESS_THAN_INCLUSIVE = 'lessThanInclusive',
  CONTAINS = 'contains',
  DOES_NOT_CONTAIN = 'doesNotContain',
  IN = 'in',
  NOT_IN = 'notIn',
}

export const factSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Fact name is required'),
  description: z.string().optional(),
  type: z.enum([FactType.NUMBER, FactType.STRING, FactType.BOOLEAN, FactType.LIST], {
    message: 'Fact type is required',
  }),
  options: z.array(z.string()).optional(),
  json_definition: z.record(z.string(), z.unknown()).optional(),
}).refine(
  (data) => {
    if (data.type === FactType.LIST) {
      return data.options && data.options.length > 0
    }
    return true
  },
  {
    message: 'Options are required for list type facts',
    path: ['options'],
  }
)

export type Fact = z.infer<typeof factSchema>

export const validateFactValue = (value: unknown, fact: Fact): boolean => {
  switch (fact.type) {
    case FactType.NUMBER:
      return typeof value === 'number' && !isNaN(value)
    case FactType.STRING:
      return typeof value === 'string'
    case FactType.BOOLEAN:
      return typeof value === 'boolean'
    case FactType.LIST:
      return typeof value === 'string' &&
        fact.options?.includes(value) === true
    default:
      return false
  }
}

export const getOperatorsForFactType = (type: string): string[] => {
  switch (type) {
    case FactType.NUMBER:
      return [Operator.EQUAL, Operator.NOT_EQUAL, Operator.GREATER_THAN, Operator.GREATER_THAN_INCLUSIVE, Operator.LESS_THAN, Operator.LESS_THAN_INCLUSIVE]
    case FactType.STRING:
      return [Operator.EQUAL, Operator.NOT_EQUAL, Operator.CONTAINS, Operator.DOES_NOT_CONTAIN]
    case FactType.BOOLEAN:
      return [Operator.EQUAL, Operator.NOT_EQUAL]
    case FactType.LIST:
      return [Operator.IN, Operator.NOT_IN]
    default:
      return [Operator.EQUAL, Operator.NOT_EQUAL]
  }
}
