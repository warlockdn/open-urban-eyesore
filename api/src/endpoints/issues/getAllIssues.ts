import { OpenAPIRoute } from "chanfana";
import { Octokit } from "@octokit/rest";
import { z } from "zod";
import type { AppContext } from "../../types";
import { issueConsolidationJob } from "../../cron-jobs/issue-consolidation";

export class GetAllIssues extends OpenAPIRoute {
  schema = {
    request: {
      query: z.object({
        process: z.boolean().optional(),
      }),
    },
    tags: ["Pull Requests"],
    summary: "Get all open GitHub Pull Requests with comments",
    responses: {
      "200": {
        description: "List of open pull requests with comments",
        content: {
          "application/json": {
            schema: z.object({
              success: z.boolean(),
              pullRequests: z.array(
                z.object({
                  comments: z.array(z.any()),
                }).catchall(z.any())
              ),
            }),
          },
        },
      },
      "500": {
        description: "Error",
        content: {
          "application/json": {
            schema: z.object({
              success: z.boolean(),
              error: z.string(),
            }),
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    try {
      const octokit = new Octokit({ auth: c.env.GITHUB_TOKEN });
      const owner = c.env.GITHUB_OWNER;
      const repo = c.env.GITHUB_REPO;

      // manually trigger the PR consolidation job
      if (c.req.query("process")) {
        console.log("Manually triggering the PR consolidation job");
        c.executionCtx.waitUntil(issueConsolidationJob());
      }

      const { data: issues } = await octokit.rest.issues.listForRepo({ owner, repo, state: "open" });

      return c.json({ 
        success: true, 
        issues: issues.map(issue => {
          return {
            id: issue.id,
            number: issue.number,
          }
        })
      });
    } catch (error) {
      return c.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, 500);
    }
  }
}
