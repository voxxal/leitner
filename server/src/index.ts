import express, { Request, Response } from "express";
import cors from "cors";
import { v1 } from "./v1";
import cookieParser from "cookie-parser";
import { pool } from "./v1/pool";
const app = express();
const port = process.env.PORT || 3000;
const corsOptions = {
  origin: "http://localhost:8080",
  credentials: true,
  exposedHeaders: ["Set-Cookie"],
};

const loggerMiddleware = (req: Request, res: Response, next: () => void) => {
  console.log("Request logged:", req.method, req.path);
  console.log("Cookies found:", JSON.stringify(req.cookies));
  console.log(pool.totalCount);
  next();
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(loggerMiddleware);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => res.send("OK"));
app.use("/v1", v1);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
