import express from "express";
import cors from "cors";
import indexRouter from "./routes/index";
import pokemonRouter from "./routes/pokemon";
import authRouter from "./routes/auth";
import meRouter from "./routes/me";
import { requestLogger } from "./middleware/logger";

export const app = express();
export const PORT: number = Number(process.env.PORT || 3001);

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Routes
app.use("/", indexRouter);
app.use("/api/pokemon", pokemonRouter);
app.use("/api/auth", authRouter);
app.use("/api/me", meRouter);
