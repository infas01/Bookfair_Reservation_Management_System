const { sendReservationEmail } = require("../../src/services/emailService");
const { transporter } = require("../../src/config/emailConfig");

// Mock the transporter
jest.mock("../../src/config/emailConfig", () => ({
    transporter: {
        sendMail: jest.fn(),
    },
    fromAddress: "Colombo Bookfair <infas1002@gmail.com>",
}));

describe("emailService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("sendReservationEmail", () => {
        it("should send email with correct options", async () => {
            const emailData = {
                email: "test@example.com",
                contactName: "John Doe",
                businessName: "Test Business",
                reservationId: "12345",
                stalls: [
                    {
                        stallCode: "A1",
                        size: "10x10",
                        hallName: "Hall A",
                    },
                ],
                validFrom: "2023-01-01",
                validTo: "2023-01-02",
                qrPngBuffer: Buffer.from("fake qr data"),
            };

            transporter.sendMail.mockResolvedValue({ messageId: "123" });

            await sendReservationEmail(emailData);

            expect(transporter.sendMail).toHaveBeenCalledTimes(1);
            const callArgs = transporter.sendMail.mock.calls[0][0];

            expect(callArgs.from).toBe("Colombo Bookfair <infas1002@gmail.com>");
            expect(callArgs.to).toBe("test@example.com");
            expect(callArgs.subject).toContain("Colombo International Bookfair");
            expect(callArgs.subject).toContain("12345");
            expect(callArgs.text).toContain("Dear John Doe");
            expect(callArgs.html).toContain("<p>Dear John Doe,</p>");
            expect(callArgs.attachments).toHaveLength(1);
            expect(callArgs.attachments[0].filename).toBe("reservation-12345-qr.png");
            expect(callArgs.attachments[0].cid).toBe("reservation-qr");
        });

        it("should handle multiple stalls", async () => {
            const emailData = {
                email: "test@example.com",
                contactName: "Jane Doe",
                businessName: "Another Business",
                reservationId: "67890",
                stalls: [
                    {
                        stallCode: "B1",
                        size: "5x5",
                        hallName: "Hall B",
                    },
                    {
                        stallCode: "B2",
                        size: "5x5",
                        hallName: "Hall B",
                    },
                ],
                validFrom: "2023-01-01",
                validTo: "2023-01-02",
                qrPngBuffer: Buffer.from("fake qr data"),
            };

            transporter.sendMail.mockResolvedValue({ messageId: "456" });

            await sendReservationEmail(emailData);

            expect(transporter.sendMail).toHaveBeenCalledTimes(1);
            const callArgs = transporter.sendMail.mock.calls[0][0];

            expect(callArgs.text).toContain("Stall(s): B1 (5x5, Hall B), B2 (5x5, Hall B)");
            expect(callArgs.html).toContain(
                "Stall(s):</strong> B1 (5x5, Hall B), B2 (5x5, Hall B)<br/>"
            );
        });
    });
});
