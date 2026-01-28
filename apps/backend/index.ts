import express from "express"
import adminRouter from "./routes/admin";
import contestRouter from "./routes/contest";
import userRouter from "./routes/user";

const app = express();

app.use(express.json())

app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/contest", contestRouter);

app.listen(3000, () => {
   console.log("Server is listening on port 3000")
})
