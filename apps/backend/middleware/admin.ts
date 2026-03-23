import { verifyToken } from "@clerk/backend";
import { prismaClient } from "@repo/db/prismaClient";
import type { Request, Response, NextFunction } from "express";

export async function adminMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization as string;

    if (!authHeader || !authHeader?.startsWith("Bearer ")) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    const token = authHeader.split(" ")[1] as string;

    try {
        const decoded = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY,
            audience: "backend"
        });
        console.log(decoded)

        if (!decoded.sub) {
            res.status(401).json({ error: "Unauthorized: no sub field" });
            return;
        }

        req.user_id = decoded.sub as string;

        const reqEmail = req.headers["x-recruiter-email"] as string;

        try {
            await prismaClient.recruiter.upsert({
                where: { clerk_id: decoded.sub },
                update: {
                    // Update email if it's provided in headers (in case it wasn't set earlier)
                    ...(reqEmail ? { email: reqEmail } : {})
                },
                create: {
                    clerk_id: decoded.sub,
                    email: reqEmail || (decoded.email as string) || "",
                }
            });

        } catch (err) {
            res.status(500).json({ message: "Server error: db upsert failed" });
            return;
        }
        next();
    } catch (error) {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
}
