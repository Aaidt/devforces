import { verifyToken } from "@clerk/backend";
import { prismaClient } from "@repo/db/prismaClient";
import type { Request, Response, NextFunction } from "express";

declare global {
    namespace Express {
        interface Request {
            user_id: string;
        }
    }
}

export const userMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1] as string;
    try {
        const decoded = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY,
        });
        if (!decoded.sub) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        req.user_id = decoded.sub as string;

        // Lazy update of user in db from clerk
        await prismaClient.user.upsert({
            where: { clerk_id: decoded.sub },
            udpate: {},
            create: {
                clerk_id: decoded.sub,
                email: decoded.email,
                role: "user"
            }
        })
        next();
    } catch (error) {
        return res.status(401).json({ error: "Unauthorized" });
    }
}