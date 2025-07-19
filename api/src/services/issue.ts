import { env } from "cloudflare:workers";
import { Octokit } from "@octokit/rest";
import { GithubIssueLabels, MapPoint } from "../types";
import { getModerators } from "./gist";
import { determineRegion } from "../utils/moderator";

export async function createIssue(data: Partial<MapPoint>) {
  const { lat, long, image, image_thumb } = data;
	
	// Initialize Octokit
	const octokit = new Octokit({
		auth: env.GITHUB_TOKEN,
	});

	const owner = env.GITHUB_OWNER;
	const repo = env.GITHUB_REPO;

	const moderators = await getModerators();
	const region = determineRegion(lat, long);
	const moderatorsForRegion = moderators[region] ?? [];

	// Generate UUID
	const uuid = crypto.randomUUID();

	// Create YAML content
	const yamlContent = `---
uuid: ${uuid}
lat: ${lat}
long: ${long}
image: ${image}
image_thumb: ${image_thumb}
category: 
created_at: ${new Date().toISOString()}
`;

	const issueTitle = `Add location data: ${lat}, ${long}`;
	const issueBody = `
# New Location Data

## Coordinates
- **Latitude**: ${lat}
- **Longitude**: ${long}
- **Map link**: [Verify on Platform](${env.PLATFORM_URL}/similar?lat=${lat}&lng=${long})

## Image
![Image](${image})

## Metadata

\`\`\`yaml
${yamlContent}
\`\`\`
`;

	// Create issue
	const issue = await octokit.rest.issues.create({
		owner, 
		repo,
		title: issueTitle,
		body: issueBody,
		assignees: [...moderatorsForRegion, env.GITHUB_OWNER],
		labels: [GithubIssueLabels.new],
	});

	return {
		issueUrl: issue.data.html_url,
		issueNumber: issue.data.number,
	};
}