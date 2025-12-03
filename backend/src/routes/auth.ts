import { Router } from "express";
import { register } from "../controllers/auth/register.controller";
import { login } from "../controllers/auth/login.controller";

const router = Router();

// POST /api/auth/register - Register a new user
router.post("/register", register);

// POST /api/auth/login - Login user
router.post("/login", login);

export default router;
