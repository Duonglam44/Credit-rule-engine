import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Settings, TestTube, Target } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Credit Rule Engine</h1>
        <p className="text-muted-foreground mt-2">
          A configurable rule engine for credit limit approvals in the finance sector
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Facts
            </CardTitle>
            <CardDescription>
              Manage data types and validation rules for credit assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/facts">Manage Facts</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Rules
            </CardTitle>
            <CardDescription>
              Create and configure business rules for credit approvals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/rules">Manage Rules</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Outcomes
            </CardTitle>
            <CardDescription>
              Define possible outcomes and actions for rule evaluation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/outcomes">Manage Outcomes</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Test Engine
            </CardTitle>
            <CardDescription>
              Test rules with sample data and validate outcomes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/test-engine">Test Rules</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Follow these steps to set up your credit rule engine
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary text-primary-foreground w-6 h-6 flex items-center justify-center text-sm">
                1
              </div>
              <div>
                <p className="font-medium">Create Facts</p>
                <p className="text-sm text-muted-foreground">
                  Define data types like credit score, income, employment status
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary text-primary-foreground w-6 h-6 flex items-center justify-center text-sm">
                2
              </div>
              <div>
                <p className="font-medium">Create Outcomes</p>
                <p className="text-sm text-muted-foreground">
                  Define possible results like &quot;Approved&quot;, &quot;Rejected&quot;, or &quot;Manual Review&quot;
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary text-primary-foreground w-6 h-6 flex items-center justify-center text-sm">
                3
              </div>
              <div>
                <p className="font-medium">Create Rules</p>
                <p className="text-sm text-muted-foreground">
                  Build business logic using facts and assign outcomes
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary text-primary-foreground w-6 h-6 flex items-center justify-center text-sm">
                4
              </div>
              <div>
                <p className="font-medium">Test Rules</p>
                <p className="text-sm text-muted-foreground">
                  Run test scenarios to validate your rule logic
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
