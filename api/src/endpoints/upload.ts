import { Num, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";
import { type AppContext } from "../types";
import { validateToken } from "../utils/token";
import { uploadImage } from "../services/upload";

export class ImageUpload extends OpenAPIRoute {
	schema = {
		tags: ["Upload"],
		summary: "Upload image to ImageKit with location data",
		request: {
			body: {
				content: {
					"application/json": {
						schema: z.object({
								lat: Num({
									required: true,
									description: "Latitude coordinate"
								}),
								lng: Num({
									required: true,
									description: "Longitude coordinate"
								}),
								image: z.object({
									fileId: Str({
										required: true,
										description: "ImageKit file ID"
									}),
									url: Str({
										required: true,
										description: "URL of the image"
									}),
									thumbnailUrl: Str({
										required: true,
										description: "URL of the thumbnail image"
									}),
								}),
								token: Str({
									required: true,
									description: "Upload token obtained from /api/tokens/upload"
								}),
						}),
					},
				},
			},
		},
		responses: {
			"200": {
				description: "Returns the upload response from ImageKit",
				content: {
					"application/json": {
						schema: z.object({
							success: z.boolean()
						}),
					},
				},
			},
			"400": {
				description: "Bad request - invalid input",
				content: {
					"application/json": {
						schema: z.object({
							success: z.boolean(),
							error: z.string(),
						}),
					},
				},
			},
			"401": {
				description: "Unauthorized - invalid or expired token",
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
	} as any;

	async handle(c: AppContext) {
		try {

			const data = await this.getValidatedData<typeof this.schema>();

			console.log("Request body ImageUpload -> ", data.body);

			const { lat, lng, image, token } = data.body;

			// Validate inputs
			if (!lat || !lng || !image || !token) {
				console.error("Missing required fields", lat, lng, image, token);
				return c.json({
					success: false,
					error: 'Missing required fields: lat, lng, image, token',
				}, 400);
			}

			// Validate token
			const isValidToken = await validateToken(token);
			if (!isValidToken) {
				console.error("Invalid token", token);
				return c.json({
					success: false,
					error: 'Invalid or expired upload token',
				}, 401);
			}

			if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
				console.error("Invalid coordinates", lat, lng);
				return c.json({
					success: false,
					error: 'Invalid coordinates. Lat must be -90 to 90, lng must be -180 to 180',
				}, 400);
			}

			await uploadImage(image, lat, lng);

			return c.json({
				success: true,
			});

		} catch (error) {
			console.error("Error uploading image", error);
			return c.json({
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error occurred',
			}, 400);
		}
	}
}
