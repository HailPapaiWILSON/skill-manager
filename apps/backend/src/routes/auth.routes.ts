import { Router } from "express";

import { register, login } from "../services/auth.service.js";

const router = Router();

router.post("/register", async (req, res) => {
  const user = await register(req.body);

  res.status(201).json(user);
});

router.post("/login", async (req, res) => {
  const user = await login(req.body);

  res.json(user);
});

export default router;
