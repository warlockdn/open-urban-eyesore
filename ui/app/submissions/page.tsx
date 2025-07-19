"use client"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import HistoricalSubmissions from "@/components/historical-submissions";

export default function SubmissionsPage() {
  return (
    <div className="flex flex-col items-center h-full w-full max-w-md mx-auto">
      <div className="flex flex-col items-center min-h-screen gap-4 w-full max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Submissions</h1>
        <Tabs defaultValue="pending-submissions" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="pending-submissions">Pending Submissions</TabsTrigger>
          <TabsTrigger value="all-submissions">All Submissions</TabsTrigger>
        </TabsList>
          <TabsContent value="pending-submissions">
            <HistoricalSubmissions type="pending" />
          </TabsContent>
          <TabsContent value="all-submissions">
            <HistoricalSubmissions type="all" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}