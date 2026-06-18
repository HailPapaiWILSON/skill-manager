import { Router } from "express";

import { cadastrar, login } from "../services/autenticacao.service.js";

const router = Router();

router.post("/cadastrar", async (req, res) => {
  const usuario = await cadastrar(req.body);

  res.status(201).json(usuario);
});

router.post("/login", async (req, res) => {
  const usuario = await login(req.body);

  res.json(usuario);
});

export default router;
