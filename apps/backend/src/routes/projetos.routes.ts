import { Router } from "express";

import {
  listarProjetos,
  obterProjetoPorId,
  obterDetalhesDoProjeto,
  criarProjeto,
  atualizarProjeto,
  deletarProjeto,
} from "../services/projetos.service.js";

import { isAdmin } from "../middleware/admin.js";

const router = Router();

router.get("/", async (_req, res) => {
  const projetos = await listarProjetos();

  res.json(projetos);
});

router.get("/:id", async (req, res) => {
  const projeto = await obterProjetoPorId(Number(req.params.id));

  if (!projeto) {
    return res.status(404).json({
      error: "Projeto não encontrado",
    });
  }

  res.json(projeto);
});

router.get("/:id/detalhes", async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID invalido" });
  }

  return obterDetalhesDoProjeto(id)
    .then((detalhes) => res.status(200).json(detalhes))
    .catch((error) =>
      res
        .status(404)
        .json({ erro: error.message || "Erro ao buscar detalhes do projeto" }),
    );
});

router.post("/", isAdmin, async (req, res) => {
  const projeto = await criarProjeto(req.body);

  res.status(201).json(projeto);
});

router.put("/:id", isAdmin, async (req, res) => {
  const projeto = await atualizarProjeto(Number(req.params.id), req.body);

  res.json(projeto);
});

router.delete("/:id", isAdmin, async (req, res) => {
  await deletarProjeto(Number(req.params.id));

  res.sendStatus(204);
});

export default router;
