import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, GitCommit, Bug, Sparkles, Zap, Shield } from "lucide-react"

interface ChangelogEntry {
  version: string;
  date: string;
  type: string;
  title: string;
  description: string;
  changes: { type: string; text: string }[];
}

const changelogData: ChangelogEntry[] = [
  {
    version: "v2.1.0",
    date: "2024-01-15",
    type: "major",
    title: "Enhanced User Experience",
    description: "Major UI overhaul with improved navigation and performance optimizations.",
    changes: [
      { type: "feature", text: "New dashboard design with dark mode support" },
      { type: "feature", text: "Advanced search functionality with filters" },
      { type: "improvement", text: "50% faster page load times" },
      { type: "fix", text: "Fixed mobile responsiveness issues" },
    ],
  },
  {
    version: "v2.0.5",
    date: "2024-01-08",
    type: "patch",
    title: "Security & Bug Fixes",
    description: "Important security updates and critical bug fixes.",
    changes: [
      { type: "security", text: "Enhanced authentication security" },
      { type: "fix", text: "Fixed data export functionality" },
      { type: "fix", text: "Resolved notification delivery issues" },
    ],
  },
  {
    version: "v2.0.4",
    date: "2024-01-02",
    type: "minor",
    title: "New Year Updates",
    description: "Starting the year with new features and improvements.",
    changes: [
      { type: "feature", text: "Added bulk actions for data management" },
      { type: "feature", text: "New analytics dashboard" },
      { type: "improvement", text: "Improved error handling and user feedback" },
    ],
  },
  {
    version: "v2.0.3",
    date: "2023-12-20",
    type: "patch",
    title: "Holiday Hotfixes",
    description: "Quick fixes before the holiday break.",
    changes: [
      { type: "fix", text: "Fixed calendar integration issues" },
      { type: "fix", text: "Resolved email template rendering problems" },
      { type: "improvement", text: "Updated dependencies for better security" },
    ],
  },
  {
    version: "v2.0.2",
    date: "2023-12-15",
    type: "minor",
    title: "Performance Improvements",
    description: "Focus on speed and reliability enhancements.",
    changes: [
      { type: "improvement", text: "Database query optimization" },
      { type: "improvement", text: "Reduced memory usage by 30%" },
      { type: "feature", text: "Added real-time status indicators" },
      { type: "fix", text: "Fixed intermittent connection timeouts" },
    ],
  },
  {
    version: "v2.0.1",
    date: "2023-12-10",
    type: "patch",
    title: "Initial Patch",
    description: "First patch release addressing early feedback.",
    changes: [
      { type: "fix", text: "Fixed user registration flow" },
      { type: "fix", text: "Corrected timezone display issues" },
      { type: "improvement", text: "Enhanced onboarding experience" },
    ],
  },
  {
    version: "v2.0.0",
    date: "2023-12-01",
    type: "major",
    title: "Major Release",
    description: "Complete platform redesign with new architecture and features.",
    changes: [
      { type: "feature", text: "Brand new user interface" },
      { type: "feature", text: "Advanced user management system" },
      { type: "feature", text: "API v2 with improved documentation" },
      { type: "improvement", text: "Complete backend rewrite for better performance" },
      { type: "breaking", text: "API v1 deprecated (migration guide available)" },
    ],
  },
]

const getChangeIcon = (type: string) => {
  switch (type) {
    case "feature":
      return <Sparkles className="h-4 w-4 text-blue-500" />
    case "improvement":
      return <Zap className="h-4 w-4 text-green-500" />
    case "fix":
      return <Bug className="h-4 w-4 text-orange-500" />
    case "security":
      return <Shield className="h-4 w-4 text-purple-500" />
    case "breaking":
      return <GitCommit className="h-4 w-4 text-red-500" />
    default:
      return <GitCommit className="h-4 w-4 text-gray-500" />
  }
}

const getVersionBadgeVariant = (type: string) => {
  switch (type) {
    case "major":
      return "default"
    case "minor":
      return "secondary"
    case "patch":
      return "outline"
    default:
      return "outline"
  }
}

export default function Component() {
  return (
    <div className="min-h-screen from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">Changelog</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Stay up to date with the latest features, improvements, and fixes to our platform.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700"></div>

          {/* Coming soon */}
          <div className="absolute left-6 w-4 h-4 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full"></div>
          </div>
          <div className="ml-16 w-full">
            <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader>
                <CardTitle>Coming Soon</CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Timeline items */}
          <div className="space-y-8">
            {[].map((entry: ChangelogEntry) => (
              <div key={entry.version} className="relative flex items-start">
                {/* Timeline dot */}
                <div className="absolute left-6 w-4 h-4 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full"></div>
                </div>

                {/* Content */}
                <div className="ml-16 w-full">
                  <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-3">
                          <Badge variant={getVersionBadgeVariant(entry.type)} className="font-mono">
                            {entry.version}
                          </Badge>
                          <CardTitle className="text-xl">{entry.title}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                          <CalendarDays className="h-4 w-4" />
                          {new Date(entry.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                      <CardDescription className="text-base">{entry.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {entry.changes.map((change, changeIndex) => (
                          <div key={changeIndex} className="flex items-start gap-3">
                            {getChangeIcon(change.type)}
                            <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                              {change.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
