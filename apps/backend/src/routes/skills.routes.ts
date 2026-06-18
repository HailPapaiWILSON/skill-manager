import { Router } from "express";

import {
  listarSkills,
  obterSkillPorId,
  criarSkill,
  atualizarSkill,
  deletarSkill,
} from "../services/skills.service.js";

const router = Router();

router.get("/", async (_req, res) => {
  const skills = await listarSkills();

  res.json(skills);
});

router.get("/:id", async (req, res) => {
  const skill = await obterSkillPorId(Number(req.params.id));

  if (!skill) {
    return res.status(404).json({
      error: "skill não encontrado",
    });
  }

  res.json(skill);
});

router.post("/", async (req: any, res: any) => {
  const skill = await criarSkill(req.body);

  res.status(201).json(skill);
});

router.put("/:id", async (req, res) => {
  const skill = await atualizarSkill(Number(req.params.id), req.body);

  res.json(skill);
});

router.delete("/:id", async (req, res) => {
  await deletarSkill(Number(req.params.id));

  res.sendStatus(204);
});

export default router;