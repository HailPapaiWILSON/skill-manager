import { Router } from "express";

import {
  listarEquipes,
  obterEquipePorId,
  criarEquipe,
  atualizarEquipe,
  deletarEquipe,
} from "../services/equipes.service.js";
import { obterDetalhesEquipe } from "../services/equipes.service.js";

import { isAdmin } from "../middleware/admin.js";

const router = Router();

router.get("/", async (_req: any, res: any) => {
  const equipes = await listarEquipes();
  res.json(equipes);
});

router.get("/:id", async (req: any, res: any) => {
  const team = await obterEquipePorId(Number(req.params.id));

  if (!team) {
    return res.status(404).json({ error: "Equipe nao encontrado" });
  }

  res.json(team);
});

router.get("/:id/detalhes", async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ erro: "ID da equipe inválido" });
  }

  const resultado = await obterDetalhesEquipe(id);

  return res.status(200).json(resultado);
});

router.post("/", isAdmin, async (req: any, res: any) => {
  const equipe = await criarEquipe(req.body);

  res.status(201).json(equipe);
});

router.put("/:id", isAdmin, async (req: any, res: any) => {
  const equipe = await atualizarEquipe(Number(req.params.id), req.body);

  res.json(equipe);
});

router.delete("/:id", isAdmin, async (req: any, res: any) => {
  await deletarEquipe(Number(req.params.id));

  res.sendStatus(204);
});

export default router;
