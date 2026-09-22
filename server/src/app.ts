import express, { type Request, type Response } from "express";
import cors from "cors";
import { HttpError } from "./errors.js";
import {
  castVote,
  getBoardMembers,
  getMeetings,
  getResolutions,
} from "./store.js";
import type { VoteChoice } from "./domain.js";

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", service: "aj-governance-api" });
  });

  app.get("/api/board-members", (_req: Request, res: Response) => {
    res.json(getBoardMembers());
  });

  app.get("/api/meetings", (_req: Request, res: Response) => {
    res.json(getMeetings());
  });

  app.get("/api/resolutions", (_req: Request, res: Response) => {
    res.json(getResolutions());
  });

  app.post(
    "/api/resolutions/:id/vote",
    (req: Request, res: Response) => {
      const choice = (req.body?.choice ?? "") as VoteChoice;
      if (choice !== "for" && choice !== "against") {
        res
          .status(400)
          .json({ error: "Field 'choice' must be 'for' or 'against'" });
        return;
      }

      try {
        const resolution = castVote(req.params.id, choice);
        res.json(resolution);
      } catch (err) {
        if (err instanceof HttpError) {
          res.status(err.status).json({ error: err.message });
          return;
        }
        res.status(500).json({ error: "Internal server error" });
      }
    },
  );

  return app;
}
