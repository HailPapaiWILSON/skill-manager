import { Router } from "express";

import {
  listarEquipes,
  obterEquipePorId,
  criarEquipe,
  atualizarEquipe,
  deletarEquipe,
} from "../services/equipes.service.js";

const router = Router();

router.get("/", async (_req: any, res: any) => {
  const teams = await listarEquipes();
  res.json(teams);
});

router.get("/:id", async (req: any, res: any) => {
  const team = await obterEquipePorId(Number(req.params.id));

  if (!team) {
    return res.status(404).json({ error: "Equipe nao encontrado" });
  }

  res.json(team);
});

router.post("/", async (req: any, res: any) => {
  const team = await criarEquipe(req.body);

  res.status(201).json(team);
});

router.put("/:id", async (req: any, res: any) => {
  const team = await atualizarEquipe(Number(req.params.id), req.body);

  res.json(team);
});

router.delete("/:id", async (req: any, res: any) => {
  await deletarEquipe(Number(req.params.id));

  res.sendStatus(204);
});

export default router;
