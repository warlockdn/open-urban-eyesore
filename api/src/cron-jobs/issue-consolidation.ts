import { Octokit } from "@octokit/rest";
import yaml from "yaml";
import { fetchGist, updateGist } from "../services/gist";
import { env } from "cloudflare:workers";
import { Category, GithubIssueLabels } from "../types";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function issueConsolidationJob() {
  console.log("Starting Issue consolidation job");
  const octokit = new Octokit({ auth: env.GITHUB_TOKEN });

  const owner = env.GITHUB_OWNER;
  const repo = env.GITHUB_REPO;

  // List open issues with the 'processed' label
  const { data: issues } = await octokit.rest.issues.listForRepo({
    owner,
    repo,
    state: "open",
    labels: GithubIssueLabels.processed,
  });

  console.log(`Found ${issues.length} open issues`);

  let hasChanges = false;
  const mapData = await fetchGist();

  await Promise.allSettled(
    issues.map(async (issue, index) => {

      const assignees = issue.assignees.map(assignee => assignee.login);

      // Get labels for the issue
      const labels = issue.labels.map(label => 
        typeof label === 'string' ? label : label.name
      );

      // Extract YAML from issue body
      const yamlMatch = issue.body?.match(/```yaml\n([\s\S]*?)```/);
      if (!yamlMatch) {
        console.log(`No YAML found in issue ${issue.number}`);
        return;
      }

      const yamlContent = yamlMatch[1];
      const yamlData = yaml.parse(yamlContent);

      // Check for approval and category labels
      const isApproved = labels.includes(GithubIssueLabels.approved);
      const categoryLabel = labels.find(label => label.startsWith('category_'));
      const categoryName = categoryLabel?.replace('category_', '') ?? '';
      const categoryNumber = Category[categoryName as keyof typeof Category] ?? -1;

      // if approved but no category, then remind to add category
      if (isApproved && categoryNumber === -1) {
        await octokit.rest.issues.createComment({
          owner,
          repo,
          issue_number: issue.number,
          body: `Please add a category to the issue.

cc: @${assignees.join(", @")}`
        });
        return;
      }
      
      if (isApproved && categoryNumber !== -1) {
        yamlData.category = categoryNumber;
        console.log(`Adding new data to the map: ${JSON.stringify(yamlData)}`);
        console.log("Existing data length", mapData.data.length);

        mapData.data = [...mapData.data, yamlData];
        console.log("New data length", mapData.data.length);
        
        hasChanges = true;

        await delay(index * 1000); // 1 second delay per index
        
        // Close the issue
        await octokit.rest.issues.update({
          owner,
          repo,
          issue_number: issue.number,
          state: "closed",
          state_reason: "completed"
        });
      } else if (labels.includes(GithubIssueLabels.rejected)) {

        console.log(`Rejected issue ${issue.number}`);

        // Close rejected issues
        await octokit.rest.issues.update({
          owner,
          repo,
          issue_number: issue.number,
          state: "closed",
          state_reason: "completed"
        });

        console.log(`Locking issue ${issue.number}`);

        await octokit.rest.issues.lock({
          owner,
          repo,
          issue_number: issue.number,
          lock_reason: "resolved",
          lock_message: "This issue has been rejected. Please review the issue and update the data if needed."
        });

      } else if (!labels.includes(GithubIssueLabels.requires_further_review)) {
        // Request review if not already requested
        await octokit.rest.issues.addLabels({
          owner,
          repo,
          issue_number: issue.number,
          labels: [GithubIssueLabels.requires_further_review]
        });

        await octokit.rest.issues.createComment({
          owner,
          repo,
          issue_number: issue.number,
          body: `
This issue needs review. Please:

1. Verify the location data
2. Check the image content
3. Assign an appropriate category label (category_critical, category_severe, category_major, or category_minor)
4. Add the 'approved' label if everything looks good, or 'rejected' if there are issues

cc: @${env.GITHUB_OWNER}`
        });
      }
    })
  );

  // Update the gist and refresh the cache if there are changes
  if (hasChanges) {
    await updateGist(mapData);
    // Refresh the cache for the endpoint
    const cacheUrl = new URL(`${env.CACHE_URL}/gist-${env.GIST_ID}`);
    const cacheKey = new Request(cacheUrl.toString());
    const cache = caches.default;
  
    const result = { success: true, result: mapData };
    const responseBody = JSON.stringify(result);
    const response = new Response(responseBody, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "max-age=7200"
      },
    });
    
    await cache.put(cacheKey, response);
  }
} 