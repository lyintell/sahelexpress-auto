import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { healthRouter } from "./routes/health.js";
import { publicRouter } from "./routes/public.js";
import { adminRouter } from "./routes/admin.js";

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.CLIENT_APP_URL, credentials: true }));
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
