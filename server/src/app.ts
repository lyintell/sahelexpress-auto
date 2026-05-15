import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { healthRouter } from "./routes/health.js";
import { publicRouter } from "./routes/public.js";
import { adminRouter } from "./routes/admin.js";

function getAllowedOrigins() {
  const configuredOrigin = new URL(env.CLIENT_APP_URL);
  const allowedOrigins = new Set([configuredOrigin.origin]);
  const hostname = configuredOrigin.hostname;

  if (hostname.startsWith("www.")) {
    allowedOrigins.add(`${configuredOrigin.protocol}//${hostname.slice(4)}${configuredOrigin.port ? `:${configuredOrigin.port}` : ""}`);
  } else if (hostname !== "localhost" && hostname !== "127.0.0.1") {
    allowedOrigins.add(`${configuredOrigin.protocol}//www.${hostname}${configuredOrigin.port ? `:${configuredOrigin.port}` : ""}`);
  }

  return allowedOrigins;
}

export function createApp() {
  const app = express();
  const allowedOrigins = getAllowedOrigins();

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.has(origin)) {
          return callback(null, true);
        }

        return callback(new Error(`Origin ${origin} is not allowed by CORS.`));
      },
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "10mb" }));

  app.use("/api", healthRouter);
  app.use("/api", publicRouter);
  app.use("/api", adminRouter);

  app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
    const message = error instanceof Error ? error.message : "Erreur serveur inconnue.";
    response.status(500).json({ message });
  });

  return app;
}
