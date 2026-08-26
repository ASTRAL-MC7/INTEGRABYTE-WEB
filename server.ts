import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { processCookingQuery } from "./server/geminiService.ts";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", app: "Ingrebyte" });
  });

  // AI Chat endpoint
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const { message, history } = req.body;
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }

      const formattedHistory = Array.isArray(history) ? history : [];
      const result = await processCookingQuery(formattedHistory, message);

      return res.json(result);
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      const errorMessage = error?.message || "Internal server error";
      return res.status(500).json({
        error: "Failed to process cooking query",
        details: errorMessage,
        fallback: {
          intent: "general",
          summaryMessage: "Something went wrong. Try again."
        }
      });
    }
  });

  // Vite development middleware vs production static files
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Ingrebyte server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
