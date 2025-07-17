const request = require("supertest");

describe("GET /ping", () => {
  it("should return pong", async () => {
    const res = await request(`http://${process.env.TARGET_HOST}:${process.env.TARGET_PORT}`).get("/ping");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("pong");
  });
});
