import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { AppContext } from "../../types";
import { env } from "cloudflare:workers";
import { fetchGist } from "../../services/gist";

export class FetchGist extends OpenAPIRoute {
	schema = {
		tags: ["Gist"],
		summary: "Fetch a gist",
		responses: {
			"200": {
				description: "Returns the gist",
				content: {
					"application/json": {
						schema: z.object({
							success: Bool(),
							result: z.any(),
						}),
					},
				},
			},
		},
	};

	async handle(c: AppContext) {
		const cacheUrl = new URL(`${env.CACHE_URL}/gist-${env.GIST_ID}`);
		const cacheKey = new Request(cacheUrl.toString());
		const cache = caches.default;
		let response: Response | undefined = undefined;

		response = await cache.match(cacheKey);

		if (!response) {
			console.log("Cache miss - fetching from GitHub");
			const content = await fetchGist();
			const result = { success: true, result: content };
			response = new Response(JSON.stringify(result), {
				headers: {
					'Content-Type': 'application/json',
				},
			});
			response.headers.append("Cache-Control", "max-age=7200"); // Cache for 2 hours
			c.executionCtx.waitUntil(cache.put(cacheKey, response.clone()));
		}

		return new Response(response.body, {
			headers: response.headers,
		});
	}
}
