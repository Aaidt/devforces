import { describe, it, expect } from "bun:test";
import axios from "axios";

describe("Resume Upload", () => {
    it("should upload a resume", async () => {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/user/resume/upload_url`, {
            filename: "test.pdf",
            content_type: "application/pdf"
        }, { headers: { "Content-Type": "application/json" } });
        if(res.status !== 200) {
            console.error(res.data);
            return;
        }
        expect(res.data.url).toBeDefined();
        expect(res.data.key).toBeDefined();
    });

    it("should confirm a resume", async () => {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/user/resume/confirm`, {
            key: "test.pdf"
        }, { headers: { "Content-Type": "application/json" } });
        if(res.status !== 200) {
            console.error(res.data);
            return;
        }
        expect(res.data.success).toBe(true);
    });

    it("should get a resume", async () => {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/user/resume`, { headers: { "Authorization": `Bearer ${process.env.CLERK_SECRET_KEY}` } });
        if(res.status !== 200) {
            console.error(res.data);
            return;
        }
        expect(res.data.resume).toBeDefined();
        expect(res.data.filename).toBeDefined();
    });
});