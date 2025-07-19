import { OpenAPIRoute, Str, Num } from "chanfana";
import { z } from "zod";
import type { AppContext, MapPoint } from "../../types";
import { createIssue } from "../../services/issue";

export class CreateIssue extends OpenAPIRoute {
	schema = {
		tags: ["Issues"],
		summary: "Create a GitHub Issue with location data",
		request: {
			body: {
				content: {
					"application/json": {
						schema: z.object({
							lat: Num({ description: "Latitude coordinate" }),
							long: Num({ description: "Longitude coordinate" }),
							image: z.object({
								fileId: Str({ description: "ImageKit file ID" }),
								url: Str({ description: "URL of the image" }),
								thumbnailUrl: Str({ description: "URL of the thumbnail image" }),
							}),
							category: Num({ description: "Category of the image" }),
						}),
					},
				},
			},
		},
		responses: {
			"200": {
				description: "Pull request created successfully",
				content: {
					"application/json": {
						schema: z.object({
							success: z.boolean(),
							pullRequestUrl: Str(),
							branchName: Str(),
							uuid: Str(),
						}),
					},
				},
			},
			"400": {
				description: "Bad request",
				content: {
					"application/json": {
						schema: z.object({
							success: z.boolean(),
							error: Str(),
						}),
					},
				},
			},
		},
	};

	async handle(c: AppContext) {
		try {
			const data = await this.getValidatedData<typeof this.schema>();
			const mapPoint: Partial<MapPoint> = {
				lat: data.body.lat,
				long: data.body.long,
				image: data.body.image.url,
				image_thumb: data.body.image.thumbnailUrl,
			}
			
			console.log("Creating pull request for", mapPoint);

			return c.json({
				success: true,
				issue: await createIssue(mapPoint),
			});

		} catch (error) {
			console.error('Error creating pull request:', error);
			return c.json({
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error occurred',
			}, 400);
		}
	}
}
