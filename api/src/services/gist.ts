import { Octokit } from "@octokit/rest";
import { env } from "cloudflare:workers";
import { parse, stringify } from "yaml";
import { MapData, Moderators } from "../types";

const octokit = new Octokit({ auth: env.GITHUB_TOKEN });

export async function fetchGist(): Promise<MapData> {
  console.log("Fetching gist", env.GIST_ID);
  const gist = await octokit.request(`GET /gists/${env.GIST_ID}`).then((res) => res.data);
  console.log("Gist fetched");
  return parse(gist.files['bmap.yaml'].content) as MapData;
}

export async function updateGist(data: MapData) {
  await octokit.request(`PATCH /gists/${env.GIST_ID}`, {
    files: {
      'bmap.yaml': {
        content: stringify(data),
      },
    },
  });
}

export async function getModerators() {
  const gist = await octokit.request(`GET /gists/${env.MODERATOR_GIST_ID}`).then((res) => res.data);
  const moderators = gist.files['moderators.yaml'].content;
  return parse(moderators) as Moderators;
}
