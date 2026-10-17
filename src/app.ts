import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import { env } from "./config/env";
import { authRoutes } from "./routes/authRoutes";
import { schoolRoutes } from "./routes/schoolRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app: Express = express();

app.use(cors({ origin: env.corsOrigins }));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/api/auth", authRoutes);
app.use("/api/schools", schoolRoutes);

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Server listening on port ${env.port}`);
});
