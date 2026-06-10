import { Router } from "express";

import {
  listUsers,
  getUserById,
  createUser,
} from "../services/users.service.js";

const router = Router();

router.get("/", async (_req, res) => {
  const users = await listUsers();
  res.json(users);
});

router.get("/:id", async (req, res) => {
  const user = await getUserById(Number(req.params.id));

  if (!user) {
    return res.status(404).json({ error: "Usuario nao encontrado" });
  }

  res.json(user);
});

router.post("/", async (req, res) => {
  const user = await createUser(req.body);

  res.status(201).json(user);
});

export default router;
