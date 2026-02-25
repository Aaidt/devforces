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
        if (!decoded.sub) {
            res.status(401).json({ error: "Unauthorized: no sub field" });
            return;
        }
        req.user_id = decoded.sub as string;

        // Lazy update of user in db from clerk
        try{
            await prismaClient.user.upsert({
                where: { clerk_id: decoded.sub },
                update: {},
                create: {
                    clerk_id: decoded.sub,
                    email: decoded.email || "",
                    first_name: "",
                    last_name: "",
                    role: "user"
                }
            })
        }catch(err){
            res.status(500).json({ message: "Server error: db upsert failed" + err });
        }
        next();
    } catch (error) {
        return res.status(401).json({ error: "Unauthorized: no user_id or db upsert failed" });
    }
} 