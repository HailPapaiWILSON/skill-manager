import { Router } from "express";

import {
  listarSkillsUsuario,
  criarSkillUsuario,
  atualizarSkillUsuario,
  deletarSkillUsuario,
} from "../services/skills-usuarios.service.js";

const router = Router();

router.get("/", async (_req, res) => {
  const skillUsuario = await listarSkillsUsuario();

  res.json(skillUsuario);
});

router.post("/", async (req, res) => {
  try {
    const { usuario_id, skill_id, nivel, anos_experiencia } = req.body;

    // 1. Validação básica de presença
    if (!usuario_id || !skill_id || !nivel) {
      return res.status(400).json({ erro: "Campos obrigatórios ausentes" });
    }

    // 2. Mapeamento explícito para satisfazer o seu schema.ts (camelCase)
    const dadosFormatados = {
      usuarioId: Number(usuario_id),
      skillId: Number(skill_id),
      nivel: nivel.toLowerCase() as "junior" | "pleno" | "senior",
      anosExperiencia: Number(anos_experiencia || 0),
    };

    // 3. Passa o objeto perfeitamente formatado para o service
    const relacao = await criarSkillUsuario(dadosFormatados);

    return res.status(201).json(relacao);
  } catch (error: any) {
    // Exibe o erro real no seu terminal do backend
    console.error("Erro ao criar relacionamento de skill:", error);

    // Retorna JSON estruturado ao invés de quebrar o Express com HTML
    return res.status(500).json({ 
      erro: "Não foi possível vincular a skill.",
      detalhes: error.message 
    });
  }
});

router.put("/:usuarioId/:skillId", async (req, res) => {
  const relacao = await atualizarSkillUsuario(
    Number(req.params.usuarioId),
    Number(req.params.skillId),
    req.body,
  );

  res.json(relacao);
});

router.delete("/:usuarioId/:skillId", async (req, res) => {
  await deletarSkillUsuario(
    Number(req.params.usuarioId),
    Number(req.params.skillId),
  );

  res.sendStatus(204);
});

export default router;
