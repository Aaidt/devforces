import { Hono } from "hono";

const userRouter = new Hono();

userRouter.post("/resume/upload_url", (c) => {
    return c.json({resume: "123"});
})

export default userRouter;