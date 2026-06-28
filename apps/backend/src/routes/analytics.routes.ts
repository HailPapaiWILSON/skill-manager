import { Router } from "express";

import {
  obterTermometro,
  obterSkillsFaltantes,
  buscarEspecialistasPorSkill,
  obterProjetosEmRisco,
  obterSkillsMaisUsadas,
  obterRankingPolivalencia,
} from "../services/analytics.service.js";

const router = Router();

// ========================================
// NOVAS ROTAS
// ========================================

/**
 * GET /thermometer/:equipeId
 * Termômetro do time - mostra % de cobertura de skills necessárias
 */
router.get("/thermometer/:equipeId", async (req, res) => {
  const equipeId = Number(req.params.equipeId);

  if (!equipeId || isNaN(equipeId)) {
    return res.status(400).json({
      erro: "Parâmetro 'equipeId' é obrigatório e deve ser um número.",
    });
  }

  try {
    const dados = await obterTermometro(equipeId);
    res.json(dados);
  } catch (error) {
    console.error("Erro no termômetro:", error);

    if (error instanceof Error && error.message.includes("Equipe não encontrada")) {
      return res.status(404).json({ erro: error.message });
    }

    res.status(500).json({ erro: "Erro interno ao buscar termômetro" });
  }
});

/**
 * GET /missing-skills/:equipeId
 * Lista do que falta - skills necessárias não cobertas pela equipe
 */
router.get("/missing-skills/:equipeId", async (req, res) => {
  const equipeId = Number(req.params.equipeId);

  if (!equipeId || isNaN(equipeId)) {
    return res.status(400).json({
      erro: "Parâmetro 'equipeId' é obrigatório e deve ser um número.",
    });
  }

  try {
    const dados = await obterSkillsFaltantes(equipeId);
    res.json(dados);
  } catch (error) {
    console.error("Erro ao buscar skills faltantes:", error);

    if (error instanceof Error && error.message.includes("Equipe não encontrada")) {
      return res.status(404).json({ erro: error.message });
    }

    res.status(500).json({ erro: "Erro interno ao buscar skills faltantes" });
  }
});

/**
 * GET /skill-experts/:equipeId
 * Quem sabe o quê - busca especialistas por skill
 * Query params: ?skillId=5 ou ?skillName=react
 */
router.get("/skill-experts/:equipeId", async (req, res) => {
  const equipeId = Number(req.params.equipeId);
  const skillId = req.query.skillId ? Number(req.query.skillId) : undefined;
  const skillName = req.query.skillName as string | undefined;

  if (!equipeId || isNaN(equipeId)) {
    return res.status(400).json({
      erro: "Parâmetro 'equipeId' é obrigatório e deve ser um número.",
    });
  }

  if (!skillId && !skillName) {
    return res.status(400).json({
      erro: "É necessário fornecer skillId OU skillName como query parameter",
    });
  }

  if (skillId && isNaN(skillId)) {
    return res.status(400).json({
      erro: "skillId deve ser um número válido",
    });
  }

  try {
    const dados = await buscarEspecialistasPorSkill(equipeId, skillId, skillName);
    res.json(dados);
  } catch (error) {
    console.error("Erro ao buscar especialistas por skill:", error);

    if (error instanceof Error) {
      if (error.message.includes("Equipe não encontrada") ||
          error.message.includes("Skill não encontrada")) {
        return res.status(404).json({ erro: error.message });
      }
    }

    res.status(500).json({ erro: "Erro interno ao buscar especialistas" });
  }
});

/**
 * GET /at-risk-projects/:equipeId
 * Projetos em risco - projetos ativos com skills faltando
 */
router.get("/at-risk-projects/:equipeId", async (req, res) => {
  const equipeId = Number(req.params.equipeId);

  if (!equipeId || isNaN(equipeId)) {
    return res.status(400).json({
      erro: "Parâmetro 'equipeId' é obrigatório e deve ser um número.",
    });
  }

  try {
    const dados = await obterProjetosEmRisco(equipeId);
    res.json(dados);
  } catch (error) {
    console.error("Erro ao buscar projetos em risco:", error);

    if (error instanceof Error && error.message.includes("Equipe não encontrada")) {
      return res.status(404).json({ erro: error.message });
    }

    res.status(500).json({ erro: "Erro interno ao buscar projetos em risco" });
  }
});

/**
 * GET /top-skills/:equipeId
 * O que o time mais faz - top 5 skills mais usadas
 */
router.get("/top-skills/:equipeId", async (req, res) => {
  const equipeId = Number(req.params.equipeId);

  if (!equipeId || isNaN(equipeId)) {
    return res.status(400).json({
      erro: "Parâmetro 'equipeId' é obrigatório e deve ser um número.",
    });
  }

  try {
    const dados = await obterSkillsMaisUsadas(equipeId);
    res.json(dados);
  } catch (error) {
    console.error("Erro ao buscar skills mais usadas:", error);

    if (error instanceof Error && error.message.includes("Equipe não encontrada")) {
      return res.status(404).json({ erro: error.message });
    }

    res.status(500).json({ erro: "Erro interno ao buscar skills mais usadas" });
  }
});

/**
 * GET /versatility-ranking/:equipeId
 * Ranking de polivalência - membros com mais skills
 */
router.get("/versatility-ranking/:equipeId", async (req, res) => {
  const equipeId = Number(req.params.equipeId);

  if (!equipeId || isNaN(equipeId)) {
    return res.status(400).json({
      erro: "Parâmetro 'equipeId' é obrigatório e deve ser um número.",
    });
  }

  try {
    const dados = await obterRankingPolivalencia(equipeId);
    res.json(dados);
  } catch (error) {
    console.error("Erro ao buscar ranking de polivalência:", error);

    if (error instanceof Error && error.message.includes("Equipe não encontrada")) {
      return res.status(404).json({ erro: error.message });
    }

    res.status(500).json({ erro: "Erro interno ao buscar ranking de polivalência" });
  }
});

export default router;
