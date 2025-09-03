import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { HelpCircle } from 'lucide-react'
import React from 'react'

const JSONTooltip = () => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
      </TooltipTrigger>
      <TooltipContent 
        side="left" 
        align="start"
        className="max-w-md p-4 bg-popover text-popover-foreground border"
      >
        <div className="space-y-3">
          <p className="font-semibold text-sm">JSON Parameter Examples:</p>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium mb-1">Credit Approval:</p>
              <pre className="bg-muted p-2 rounded text-xs overflow-x-auto whitespace-pre-wrap">
{`{
  "message": "Credit approved",
  "limit": 10000,
  "rate": 0.05
}`}
              </pre>
            </div>
            <div>
              <p className="text-xs font-medium mb-1">Credit Rejection:</p>
              <pre className="bg-muted p-2 rounded text-xs overflow-x-auto whitespace-pre-wrap">
{`{
  "message": "Credit denied",
  "reason": "Insufficient income",
  "contact": "support@bank.com"
}`}
              </pre>
            </div>
            <div>
              <p className="text-xs font-medium mb-1">Simple Message:</p>
              <pre className="bg-muted p-2 rounded text-xs overflow-x-auto whitespace-pre-wrap">
{`{
  "message": "Application pending"
}`}
              </pre>
            </div>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

export default JSONTooltip