import { Router } from "express";

import {
  listarSkillsProjeto,
  criarSkillProjeto,
  deletarSkillProjeto,
} from "../services/skills-projetos.service.js";

const router = Router();

router.get("/", async (_req, res) => {
  const dados = await listarSkillsProjeto();

  res.json(dados);
});

router.post("/", async (req, res) => {
  const relacao = await criarSkillProjeto(req.body);

  res.status(201).json(relacao);
});

router.delete("/:projetoId/:skillId", async (req, res) => {
  await deletarSkillProjeto(
    Number(req.params.projetoId),
    Number(req.params.skillId),
  );

  res.sendStatus(204);
});

export default router;