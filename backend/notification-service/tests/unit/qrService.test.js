const { buildReservationQrPayload, generateQrPng } = require("../../src/services/qrService");

describe("qrService", () => {
    describe("buildReservationQrPayload", () => {
        it("should build the correct JSON payload", () => {
            const payload = {
                reservationId: "123",
                businessName: "Test Business",
                email: "test@example.com",
                stalls: [
                    {
                        stallId: "1",
                        stallCode: "A1",
                        hallName: "Hall A",
                        size: "10x10",
                    },
                ],
                validFrom: "2023-01-01",
                validTo: "2023-01-02",
            };

            const result = buildReservationQrPayload(payload);
            const parsed = JSON.parse(result);

            expect(parsed.reservationId).toBe("123");
            expect(parsed.businessName).toBe("Test Business");
            expect(parsed.email).toBe("test@example.com");
            expect(parsed.stalls).toEqual([
                {
                    stallId: "1",
                    stallCode: "A1",
                    hallName: "Hall A",
                    size: "10x10",
                },
            ]);
            expect(parsed.validFrom).toBe("2023-01-01");
            expect(parsed.validTo).toBe("2023-01-02");
            expect(parsed.issuedAt).toBeDefined();
        });
    });

    describe("generateQrPng", () => {
        it("should generate a Buffer from data", async () => {
            const data = "test data";
            const result = await generateQrPng(data);

            expect(Buffer.isBuffer(result)).toBe(true);
            expect(result.length).toBeGreaterThan(0);
        });
    });
});
