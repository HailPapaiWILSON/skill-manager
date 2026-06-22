import { Router } from "express";

import {
  listarUsuarios,
  obterUsuarioPorId,
  atualizarBioUsuario,
  atualizarPerfilUsuario,
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

router.put("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { nome, bio } = req.body;
    const usuarioLogado = req.usuario;
    if (!usuarioLogado || usuarioLogado.id !== id) {
      return res
        .status(403)
        .json({ error: "Você só pode editar seu próprio perfil" });
    }
    if (nome === undefined && bio === undefined) {
      return res
        .status(400)
        .json({ error: "Envie pelo menos um campo (nome ou bio)" });
    }
    const resultado = await atualizarPerfilUsuario(id, { nome, bio });
    res.json(resultado);
  } catch (error) {
    next(error);
  }
});

export default router;
