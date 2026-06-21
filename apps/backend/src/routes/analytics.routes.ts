import { Router } from "express";

import {
  buscarEspecialistas,
  obterHeatmap,
  obterRiscoTecnico,
  obterGapsDaEquipe,
} from "../services/analytics.service.js";

const router = Router();

router.get("/experts", async (req, res) => {
  const skillId = Number(req.query.skillId);
  const nivel = req.query.nivel as string | undefined;

  if (!skillId || isNaN(skillId)) {
    return res.status(400).json({
      erro: "Parâmetro 'skillId' é obrigatório e deve ser um número.",
    });
  }

  const resultados = await buscarEspecialistas(skillId, nivel);
  res.json(resultados);
});

router.get("/heatmap", async (req, res) => {
  const dados = await obterHeatmap();
  res.json(dados);
});

router.get("/tech-risk", async (req, res) => {
  const threshold = Number(req.query.threshold) || 2;
  const dados = await obterRiscoTecnico(threshold);
  res.json(dados);
});

router.get("/gaps", async (req, res) => {
  const equipeId = Number(req.query.equipeId);

  if (!equipeId || isNaN(equipeId)) {
    return res.status(400).json({
      erro: "Parâmetro 'equipeId' é obrigatório e deve ser um número.",
    });
  }

  const gaps = await obterGapsDaEquipe(equipeId);
  res.json(gaps);
});

export default router;
