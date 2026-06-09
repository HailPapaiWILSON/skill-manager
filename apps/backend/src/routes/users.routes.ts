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
})

