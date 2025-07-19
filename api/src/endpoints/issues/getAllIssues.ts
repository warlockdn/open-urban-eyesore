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
        ids: z.string().optional(),
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
      if (c.req.query("process") && c.env.ENV === "LOCAL") {
        console.log("Manually triggering the PR consolidation job");
        c.executionCtx.waitUntil(issueConsolidationJob());
        return c.json({ success: true, message: "PR consolidation job triggered" });
      }

      const env = c.env.ENV;
      const pendingIssues = c.req.query("ids")?.split(",").map(Number);

      if (env === "PROD" && !pendingIssues) {
        return c.json({ success: false, error: "issue numbers missing" }, 400);
      }

      // Create cache key based on issue IDs
      const cacheKey = `issues:${pendingIssues?.join(",") || "all"}`;
      const cacheUrl = new URL(`${c.env.CACHE_URL}/${cacheKey}`);
      const cacheRequest = new Request(cacheUrl.toString());
      const cache = caches.default;
      
      // Try to get from cache first
      const cached = await cache.match(cacheRequest);
      if (cached) {
        console.log("Cache hit for ", cacheKey);
        return c.json(JSON.parse(await cached.text()), 200, {
          "Cache-Control": "public, max-age=900" // 15 minutes
        });
      }

      console.log("Cache miss for ", cacheKey);

      const pendingIssuesList = await Promise.all(pendingIssues
        ?.map(issue => octokit.rest.issues.get({ owner, repo, issue_number: issue, state: "open" })) || []);

      const response = {
        success: true,
        issues: pendingIssuesList.map(issue => {
          return {
            id: issue.data.id,
            number: issue.data.number,
            state: issue.data.state,
            labels: issue.data.labels.map((label: any) => label.name),
            url: issue.data.html_url,
          }
        })
      };

      // Cache the response for 15 minutes
      const cacheResponse = new Response(JSON.stringify(response), {
        headers: {
          "Cache-Control": "public, max-age=900" // 15 minutes
        }
      });
      c.executionCtx.waitUntil(
        cache.put(cacheRequest, cacheResponse)
      );

      return c.json(response, 200, {
        "Cache-Control": "public, max-age=900" // 15 minutes
      });
    } catch (error) {
      return c.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, 500);
    }
  }
}
