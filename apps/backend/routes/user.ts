import { Router } from "express";
import { prisma } from "db/prismaClient"

const router = Router();

router.post("/user/signup", (req, res) => {
   res.send("Admin route")
})

router.post("/user/login", (req, res) => {

})

export default router
