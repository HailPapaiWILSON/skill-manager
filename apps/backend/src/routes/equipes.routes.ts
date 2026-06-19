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
  const equipes = await listarEquipes();
  res.json(equipes);
});

router.get("/:id/detalhes", async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ erro: "ID da equipe inválido" });
  }

  const resultado = await obterEquipePorId(id);

  return res.status(200).json(resultado);
});

router.post("/", async (req: any, res: any) => {
  const equipe = await criarEquipe(req.body);

  res.status(201).json(equipe);
});

router.put("/:id", async (req: any, res: any) => {
  const equipe = await atualizarEquipe(Number(req.params.id), req.body);

  res.json(equipe);
});

router.delete("/:id", async (req: any, res: any) => {
  await deletarEquipe(Number(req.params.id));

  res.sendStatus(204);
});

export default router;
