import { Hono } from "hono";

const adminRouter = new Hono();

adminRouter.get("/applicants", (c) => {
    return c.text("applicants");
})

export default adminRouter