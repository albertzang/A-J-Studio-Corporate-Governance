import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";

describe("governance API", () => {
  const app = createApp();

  it("reports health", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("lists the five board members", async () => {
    const res = await request(app).get("/api/board-members");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(5);
    expect(res.body[0]).toHaveProperty("role");
  });

  it("lists meetings", async () => {
    const res = await request(app).get("/api/meetings");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("rejects an invalid vote choice", async () => {
    const res = await request(app)
      .post("/api/resolutions/res-1/vote")
      .send({ choice: "maybe" });
    expect(res.status).toBe(400);
  });

  it("returns 404 when voting on an unknown resolution", async () => {
    const res = await request(app)
      .post("/api/resolutions/does-not-exist/vote")
      .send({ choice: "for" });
    expect(res.status).toBe(404);
  });

  it("passes a resolution once it reaches a majority of 'for' votes", async () => {
    let body: { status: string; votesFor: number } = {
      status: "open",
      votesFor: 0,
    };
    for (let i = 0; i < 3; i += 1) {
      const res = await request(app)
        .post("/api/resolutions/res-2/vote")
        .send({ choice: "for" });
      expect(res.status).toBe(200);
      body = res.body;
    }
    expect(body.votesFor).toBe(3);
    expect(body.status).toBe("passed");
  });

  it("refuses further votes once a resolution is decided", async () => {
    for (let i = 0; i < 3; i += 1) {
      await request(app)
        .post("/api/resolutions/res-3/vote")
        .send({ choice: "against" });
    }
    const res = await request(app)
      .post("/api/resolutions/res-3/vote")
      .send({ choice: "for" });
    expect(res.status).toBe(409);
  });
});
