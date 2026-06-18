import { Router } from "express";

import {
  listarProjetos,
  obterProjetoPorId,
  criarProjeto,
  atualizarProjeto,
  deletarProjeto,
} from "../services/projetos.service.js";

const router = Router();

router.get("/", async (_req, res) => {
  const projetos = await listarProjetos();

  res.json(projetos);
});

router.get("/:id", async (req, res) => {
  const projeto = await obterProjetoPorId(
    Number(req.params.id)
  );

  if (!projeto) {
    return res.status(404).json({
      error: "Projeto não encontrado",
    });
  }

  res.json(projeto);
});

router.post("/", async (req, res) => {
  const projeto = await criarProjeto(req.body);

  res.status(201).json(projeto);
});

router.put("/:id", async (req, res) => {
  const projeto = await atualizarProjeto(
    Number(req.params.id),
    req.body
  );

  res.json(projeto);
});

router.delete("/:id", async (req, res) => {
  await deletarProjeto(Number(req.params.id));

  res.sendStatus(204);
});

export default router;