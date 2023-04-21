import express from "express";
import * as dotenv from "dotenv";
import scrappingRouter from "./routes/index.js";
dotenv.config();
const app = express();
app.use(express.json({ limit: "50mb" }));
app.use("/", scrappingRouter);
app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
