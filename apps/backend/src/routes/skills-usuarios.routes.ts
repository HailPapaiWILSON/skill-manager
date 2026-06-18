import { Router } from "express";

import {
  listarSkillsUsuario,
  criarSkillUsuario,
  atualizarSkillUsuario,
  deletarSkillUsuario,
} from "../services/skills-usuarios.service.js";

const router = Router();

router.get("/", async (_req, res) => {
  const skillUsuario = await listarSkillsUsuario();

  res.json(skillUsuario);
});

router.get("/", async (req, res) => {
  const relacao = await criarSkillUsuario(req.body);

  res.status(201).json(relacao);
});

router.put("/:usuarioId/:skillId", async (req, res) => {
  const relacao = await atualizarSkillUsuario(
    Number(req.params.usuarioId),
    Number(req.params.skillId),
    req.body,
  );

  res.json(relacao);
});

router.delete("/:usuarioId/:skillId", async (req, res) => {
  await deletarSkillUsuario(
    Number(req.params.usuarioId),
    Number(req.params.skillId),
  );

  res.sendStatus(204);
});

export default router;
