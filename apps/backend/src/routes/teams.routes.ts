import { Router } from "express";

import {
  listTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
} from "../services/teams.service.js";

const router = Router();

router.get("/", async (_req: any, res: any) => {
  const teams = await listTeams();
  res.json(teams);
});

router.get("/:id", async (req, res) => {
  const team = await getTeamById(Number(req.params.id));

  if (!team) {
    return res.status(404).json({ error: "Equipe nao encontrado" });
  }

  return.json(team);
});

router.post("/", async (req, res) => {
  const team = await createTeam(req.body);

  res.status(201).json(team);
});
