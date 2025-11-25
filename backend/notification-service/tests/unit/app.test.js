process.env.SMTP_HOST = "localhost";
process.env.SMTP_PORT = "587";
process.env.SMTP_USER = "test";
process.env.SMTP_PASS = "test";

const request = require("supertest");
const app = require("../../src/app");

describe("App", () => {
    describe("GET /health", () => {
        it("should return status ok", async () => {
            const response = await request(app).get("/health").expect(200);

            expect(response.body).toEqual({ status: "ok", service: "notification-service" });
        });
    });
});
