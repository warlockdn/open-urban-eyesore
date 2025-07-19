import { fromHono } from "chanfana";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { FetchGist } from "./endpoints/gist/fetchGist";
import { ImageUpload } from "./endpoints/upload";
import { GetAllIssues } from "./endpoints/issues/getAllIssues";
import { GenerateUploadToken } from "./endpoints/tokens/generateUploadToken";
import { issueConsolidationJob } from "./cron-jobs/issue-consolidation";
import { env } from "cloudflare:workers";
import { ImageKitAuth } from "./endpoints/tokens/imagekit-auth";

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

console.log("ALLOWED_ORIGINS", env.ALLOWED_ORIGINS.split(","));

// Add CORS middleware for localhost:3000
(app as any).use(
	'/api/*',
	cors({
		origin: env.ALLOWED_ORIGINS.split(","),
		allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowHeaders: ["Content-Type"],
	})
);

// Setup OpenAPI registry
const openapi = fromHono(app, {
	docs_url: env.ENV === "LOCAL" ? "/" : undefined,
});

openapi.get("/api/data", FetchGist);
openapi.get("/api/issues", GetAllIssues);
openapi.post("/api/upload", ImageUpload);
openapi.get("/api/tokens/upload", GenerateUploadToken);
openapi.get("/api/tokens/image", ImageKitAuth);

// Export both the fetch and scheduled handlers
export default {
	fetch: (app as any).fetch.bind(app),
	scheduled: issueConsolidationJob
};
