import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import ImageKit from "imagekit";
import { type AppContext } from "../../types";

export class ImageKitAuth extends OpenAPIRoute {
  static schema = {
    tags: ["Auth"],
    summary: "Get ImageKit authentication parameters",
    responses: {
      "200": {
        description: "Returns ImageKit authentication parameters",
        content: {
          "application/json": {
            schema: z.object({
              token: z.string(),
              expire: z.number(),
              signature: z.string(),
              publicKey: z.string(),
            }),
          },
        },
      },
    },
  } as any;

  async handle(c: AppContext) {
    const imagekit = new ImageKit({
      publicKey: c.env.IMAGEKIT_PUBLIC_KEY as string,
      privateKey: c.env.IMAGEKIT_PRIVATE_KEY as string,
      urlEndpoint: c.env.IMAGEKIT_URL_ENDPOINT as string,
    });

    const randomToken = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const timestamp = Date.now().toString(36)
      const random = Array.from({length: 16}, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('')
      return `${random}-${timestamp}-${Math.random().toString(36).slice(2)}`
    }

    const { token, expire, signature } = imagekit.getAuthenticationParameters(
      randomToken(),
    );

    return Response.json({
      token,
      expire,
      signature,
      publicKey: c.env.IMAGEKIT_PUBLIC_KEY,
    });
  }
} 