import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import { env } from "./config/env";
import { authRoutes } from "./routes/authRoutes";
import { schoolRoutes } from "./routes/schoolRoutes";
import { userRoutes } from "./routes/userRoutes";
import { organizationRoutes } from "./routes/organizationRoutes";
import { staffRoutes } from "./routes/staffRoutes";
import { onboardingRoutes } from "./routes/onboardingRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app: Express = express();

app.use(cors({ origin: env.corsOrigins }));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/api/auth", authRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/users", userRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/onboarding", onboardingRoutes);

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Server listening on port ${env.port}`);
});
