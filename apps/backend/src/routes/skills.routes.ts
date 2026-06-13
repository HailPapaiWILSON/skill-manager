import { Router } from "express";

import {
  listSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
} from "../services/skills.service.js";
import { skills } from "../db/schema.js";

const router = Router();

router.get("/", async (_req, res) => {
  const skills = await listSkills();

  res.json(skills);
});

router.get("/:id", async (req, res) => {
  const skill = await getSkillById(Number(req.params.id));

  if (!skill) {
    return res.status(404).json({
      error: "skill não encontrado",
    });
  }

  res.json(skill);
});

router.post("/", async (req: any, res: any) => {
  const skill = await createSkill(req.body);

  res.status(201).json(skill);
});

router.put("/:id", async (req, res) => {
  const skill = await updateSkill(Number(req.params.id), req.body);

  res.json(skill);
});

router.delete("/:id", async (req, res) => {
  await deleteSkill(Number(req.params.id));

  res.sendStatus(204);
});
