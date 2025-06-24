import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { AppContext } from "../../types";
import { generateToken } from "../../utils/token";

export class GenerateUploadToken extends OpenAPIRoute {
    schema = {
        tags: ["Tokens"],
        summary: "Generate a temporary upload token",
        responses: {
            "200": {
                description: "Returns a temporary upload token",
                content: {
                    "application/json": {
                        schema: z.object({
                            success: z.boolean(),
                            data: z.object({
                                token: z.string(),
                                expiresAt: z.number(),
                            }),
                        }),
                    },
                },
            },
        },
    } as any;

    async handle(c: AppContext) {
        try {
            const { token, expiresAt } = await generateToken();
            
            return c.json({
                success: true,
                data: {
                    token,
                    expiresAt,
                }
            });
        } catch (error) {
            return c.json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to generate token',
            }, 500);
        }
    }
} 