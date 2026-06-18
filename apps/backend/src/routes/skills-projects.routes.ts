import { Router } from "express";

import {
  listProjectSkills,
  createProjectSkill,
  deleteProjectSkill,
} from "../services/skills-projects.service.js";

const router = Router();

router.get("/", async (_req, res) => {
  const data = await listProjectSkills();

  res.json(data);
});

router.post("/", async (req, res) => {
  const relation = await createProjectSkill(req.body);

  res.status(201).json(relation);
});

router.delete("/:projetoId/:skillId", async (req, res) => {
  await deleteProjectSkill(
    Number(req.params.projetoId),
    Number(req.params.skillId),
  );

  res.sendStatus(204);
});

export default router;
