import { Router } from "express";

import {
  listarUsuarios,
  obterUsuarioPorId,
} from "../services/usuarios.service.js";

const router = Router();

router.get("/", async (_req, res) => {
  const usuarios = await listarUsuarios();
  res.json(usuarios);
});

router.get("/:id", async (req, res) => {
  const usuario = await obterUsuarioPorId(Number(req.params.id));

  if (!usuario) {
    return res.status(404).json({ error: "Usuario nao encontrado" });
  }

  res.json(usuario);
});

export default router;