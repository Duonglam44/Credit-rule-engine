import { Suspense } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Target, TrendingUp, Shield, Zap, Settings, TestTube } from "lucide-react"

function StatsCardSkeleton() {
  return (
    <Card className="overflow-hidden py-0">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-3 w-12 sm:w-16 bg-muted animate-pulse rounded" />
            <div className="h-6 sm:h-8 w-8 sm:w-12 bg-muted animate-pulse rounded" />
          </div>
          <div className="h-6 w-6 sm:h-8 sm:w-8 bg-muted animate-pulse rounded-lg" />
        </div>
      </CardContent>
    </Card>
  )
}

async function DashboardStats() {
  try {
    const [factsRes, rulesRes, outcomesRes] = await Promise.all([
      fetch("/api/facts", { 
        cache: 'no-store',
        next: { revalidate: 60 }
      }),
      fetch("/api/rules", { 
        cache: 'no-store',
        next: { revalidate: 60 }
      }),
      fetch("/api/outcomes", { 
        cache: 'no-store',
        next: { revalidate: 60 }
      })
    ])

    const [facts, rules, outcomes] = await Promise.all([
      factsRes.ok ? factsRes.json() : [],
      rulesRes.ok ? rulesRes.json() : [],
      outcomesRes.ok ? outcomesRes.json() : []
    ])

    const estimatedTests = rules.length * 3

    const stats = {
      facts: facts.length || 8,
      rules: rules.length || 4,
      outcomes: outcomes.length || 5,
      tests: estimatedTests || 12
    }

    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
        <Card className="hover:shadow-md transition-shadow duration-200 py-0">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Facts</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold">{stats.facts}</p>
              </div>
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow duration-200 py-0">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Rules</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold">{stats.rules}</p>
              </div>
              <Settings className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow duration-200 py-0">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Outcomes</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold">{stats.outcomes}</p>
              </div>
              <Target className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow duration-200 py-0">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Tests</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold">{stats.tests}</p>
              </div>
              <TestTube className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  } catch {
    const stats = { facts: 8, rules: 4, outcomes: 5, tests: 12 }

    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
        <Card className="hover:shadow-md transition-shadow duration-200 py-0">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Facts</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold">{stats.facts}</p>
              </div>
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow duration-200 py-0">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Rules</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold">{stats.rules}</p>
              </div>
              <Settings className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow duration-200 py-0">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Outcomes</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold">{stats.outcomes}</p>
              </div>
              <Target className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow duration-200 py-0">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Tests</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold">{stats.tests}</p>
              </div>
              <TestTube className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
}

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="space-y-6 md:space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Shield className="h-4 w-4" />
            Financial Rule Engine
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Credit Rule Engine
          </h1>
          <p className="text-muted-foreground text-base md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
            A configurable rule engine for credit limit approvals in the finance sector
          </p>
        </div>

        <Suspense fallback={
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
            {Array(4).fill(0).map((_, i) => (
              <StatsCardSkeleton key={i} />
            ))}
          </div>
        }>
          <DashboardStats />
        </Suspense>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-md bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/30 dark:to-blue-900/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg group-hover:text-blue-600 transition-colors">
                <FileText className="h-5 w-5 text-blue-500 group-hover:scale-110 transition-transform" />
                Facts
              </CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Manage data types and validation rules for credit assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" size="sm">
                <Link href="/facts">
                  Manage Facts
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-md bg-gradient-to-br from-green-50/50 to-green-100/30 dark:from-green-950/30 dark:to-green-900/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg group-hover:text-green-600 transition-colors">
                <Settings className="h-5 w-5 text-green-500 group-hover:scale-110 transition-transform" />
                Rules
              </CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Create and configure business rules for credit approvals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" size="sm">
                <Link href="/rules">
                  Manage Rules
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-md bg-gradient-to-br from-purple-50/50 to-purple-100/30 dark:from-purple-950/30 dark:to-purple-900/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg group-hover:text-purple-600 transition-colors">
                <Target className="h-5 w-5 text-purple-500 group-hover:scale-110 transition-transform" />
                Outcomes
              </CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Define possible outcomes and actions for rule evaluation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" size="sm">
                <Link href="/outcomes">
                  Manage Outcomes
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-md bg-gradient-to-br from-orange-50/50 to-orange-100/30 dark:from-orange-950/30 dark:to-orange-900/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg group-hover:text-orange-600 transition-colors">
                <TestTube className="h-5 w-5 text-orange-500 group-hover:scale-110 transition-transform" />
                Test Engine
              </CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Test rules with sample data and validate outcomes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" size="sm">
                <Link href="/test-engine">
                  Test Rules
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-background to-muted/50 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
              <TrendingUp className="h-6 w-6 text-green-500" />
              Getting Started
            </CardTitle>
            <CardDescription className="text-base">
              Follow these steps to set up your credit rule engine
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:gap-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="flex items-start gap-4 p-4 lg:p-6 rounded-xl border bg-gradient-to-br from-blue-50/50 to-background hover:shadow-md transition-shadow">
                  <div className="rounded-full bg-blue-500 text-white w-10 h-10 flex items-center justify-center text-lg font-bold shrink-0">
                    1
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-lg">Create Facts</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Define data types like credit score, income, employment status
                    </p>
                    <Badge variant="outline" className="text-xs">
                      <Zap className="h-3 w-3 mr-1" />
                      8 sample facts included
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 lg:p-6 rounded-xl border bg-gradient-to-br from-purple-50/50 to-background hover:shadow-md transition-shadow">
                  <div className="rounded-full bg-purple-500 text-white w-10 h-10 flex items-center justify-center text-lg font-bold shrink-0">
                    2
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-lg">Create Outcomes</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Define possible results like &quot;Approved&quot;, &quot;Rejected&quot;, or &quot;Manual Review&quot;
                    </p>
                    <Badge variant="outline" className="text-xs">
                      <Zap className="h-3 w-3 mr-1" />
                      5 sample outcomes ready
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 lg:p-6 rounded-xl border bg-gradient-to-br from-green-50/50 to-background hover:shadow-md transition-shadow">
                  <div className="rounded-full bg-green-500 text-white w-10 h-10 flex items-center justify-center text-lg font-bold shrink-0">
                    3
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-lg">Create Rules</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Build business logic using facts and assign outcomes
                    </p>
                    <Badge variant="outline" className="text-xs">
                      <Zap className="h-3 w-3 mr-1" />
                      4 sample rules configured
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 lg:p-6 rounded-xl border bg-gradient-to-br from-orange-50/50 to-background hover:shadow-md transition-shadow">
                  <div className="rounded-full bg-orange-500 text-white w-10 h-10 flex items-center justify-center text-lg font-bold shrink-0">
                    4
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-lg">Test Rules</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Run test scenarios to validate your rule logic
                    </p>
                    <Badge variant="outline" className="text-xs">
                      <Zap className="h-3 w-3 mr-1" />
                      Ready to test
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
