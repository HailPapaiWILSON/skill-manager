import { Router } from "express";

import {
  listarUsuarios,
  obterUsuarioPorId,
  atualizarBioUsuario,
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

router.put("/:id/bio", async (req, res) => {
  const id = Number(req.params.id);

  const { bio } = req.body;

  if (typeof bio !== "string") {
    return res.status(400).json({ error: "O campo bio deve ser uma string" });
  }

  const usuarioExistente = await obterUsuarioPorId(id);

  if (!usuarioExistente) {
    return res.status(404).json({ error: "Usuario nao encontrado" });
  }

  const resultado = await atualizarBioUsuario(id, bio);
  
  res.json(resultado[0] || { message: "Bio atualizada com sucesso" });
});

export default router;