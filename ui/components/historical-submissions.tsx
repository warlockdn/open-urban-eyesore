"use client";

import Link from "next/link";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge"

import { ArrowRightIcon, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";

import type { Submission } from "@/lib/types";
import { getSubmissionsFromLocalStorage, updateSubmissionStatusInLocalStorage } from "@/lib/utils";

export default function HistoricalSubmissions({
  type,
}: {
  type: "pending" | "all";
}) {

  const [isLoading, setIsLoading] = useState(true);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {

    const existingSubmissions = getSubmissionsFromLocalStorage();

    const pendingSubmissions = existingSubmissions
      .filter((submission: Submission) => type === "pending" ? submission.state === "open" : true)
      .map((submission: Submission) => submission.number);

    const fetchSubmissions = async () => {
      try {
        // Split submissions into batches of 10
        const batchSize = 10;
        const batches = [];
        for (let i = 0; i < pendingSubmissions.length; i += batchSize) {
          batches.push(pendingSubmissions.slice(i, i + batchSize));
        }

        const allSubmissions: Submission[] = [];

        // Process batches with staggered delays
        for (let i = 0; i < batches.length; i++) {
          const batch = batches[i];
          
          // Add delay between batches (except for the first one)
          if (i > 0) {
            await new Promise(resolve => setTimeout(resolve, 200)); // 200ms delay
          }

          const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/issues?ids=${batch.join(",")}`);
          const data = await response.json();
          
          if (data.issues) {
            allSubmissions.push(...data.issues);
          }
        }

        setSubmissions(allSubmissions);

        // Get all submissions that with state closed and update their status in local storage
        const closedSubmissions = allSubmissions.filter((submission: Submission) => submission.state === "closed");
        updateSubmissionStatusInLocalStorage(closedSubmissions.map((submission: Submission) => {
          return {
            number: submission.number,
            status: submission.labels.includes("approved") ? "approved" : "rejected",
          }
        }));

      } catch (error) {
        toast.error("Error fetching submissions", {
          description: error instanceof Error ? error.message : "Unknown error",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  const getStatus = (submission: Submission) => {
    // if label has new, return pending
    if (submission.labels.includes("new")) return "pending";
    if (submission.labels.includes("approved")) return "approved";
    if (submission.labels.includes("rejected")) return "rejected";
    return "pending";
  };

  const getStatusText = (submission: Submission) => {
    if (submission.labels.includes("new")) return "Pending";
    if (submission.labels.includes("approved")) return "Approved";
    if (submission.labels.includes("rejected")) return "Rejected";
    return "Pending";
  };

  return (
    <>
      {isLoading && <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-4 h-4 animate-spin" />
      </div>}
      <Table>
        <TableCaption>A list of your {type === "pending" ? "pending" : "all"} submissions.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Submission ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Labels</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow key={submission.id}>
              <TableCell className="font-medium">{submission.id}</TableCell>
              <TableCell>{submission.state.charAt(0).toUpperCase() + submission.state.slice(1)}</TableCell>
              <TableCell>
                <Badge variant={getStatus(submission)}>{getStatusText(submission)}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Link href={submission.url} target="_blank">
                  <span className="flex items-center gap-2">View <ArrowRightIcon className="w-4 h-4" /></span>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Toaster position="top-center" richColors />
    </>
  );
}