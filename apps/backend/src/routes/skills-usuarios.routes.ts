import { Router } from "express";

import {
  listUserSkills,
  createUserSkill,
  updateUserSkill,
  deleteUserSkill,
} from "../services/skills-users.service.js";

const router = Router();

router.get("/", async (_req, res) => {
  const skillUser = await listUserSkills();

  res.json(skillUser);
});

router.get("/", async (req, res) => {
  const relation = await createUserSkill(req.body);

  res.status(201).json(relation);
});

router.put("/:usuarioId/:skillId", async (req, res) => {
  const relation = await updateUserSkill(
    Number(req.params.usuarioId),
    Number(req.params.skillId),
    req.body,
  );

  res.json(relation);
});

router.delete("/:usuarioId/:skillId", async (req, res) => {
  await deleteUserSkill(
    Number(req.params.usuarioId),
    Number(req.params.skillId),
  );

  res.sendStatus(204);
});

export default router;
