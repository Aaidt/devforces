import { Router } from "express";

const adminRouter = Router();

adminRouter.get("/", (req, res) => {
  res.send("Hello World");
});

export default adminRouter;