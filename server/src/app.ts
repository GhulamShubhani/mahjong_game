import express from "express";
import cors from "cors";
import { router } from "./routes";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

const devOrigin =
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }
      if (devOrigin.test(origin)) {
        callback(null, origin);
        return;
      }
      callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy" });
});

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy" });
});

app.use("/api/v1", router);

app.use(errorHandler);

export default app;