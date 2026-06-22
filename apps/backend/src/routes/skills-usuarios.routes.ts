import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from "express";

import {
  listarSkillsUsuario,
  criarSkillUsuario,
  atualizarSkillUsuario,
  deletarSkillUsuario,
} from "../services/skills-usuarios.service.js";

import { checkOwnerOrAdmin } from "../middleware/ownership.js";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  const skillUsuario = await listarSkillsUsuario();

  res.json(skillUsuario);
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { usuarioId, skillId, nivel, anosExperiencia } = req.body;
    const logado = req.usuario;

    if (!logado) {
      return res.status(401).json({ error: "Nao autenticado" });
    }

    if (logado.id !== usuarioId && logado.funcao !== "administrador") {
      return res.status(403).json({
        erro: "Você só pode adicionar skills ao seu próprio perfil (ou é admin)",
      });
    }

    const relacao = await criarSkillUsuario({
      usuarioId,
      skillId,
      nivel,
      anosExperiencia,
    });
    res.status(201).json(relacao);
  } catch (error) {
    next(error);
  }
});

router.put(
  "/:usuarioId/:skillId",
  checkOwnerOrAdmin((req) => Number(req.params.usuarioId)),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const usuarioId = Number(req.params.usuarioId);
      const skillId = Number(req.params.skillId);

      const { nivel, anosExperiencia } = req.body;

      const relacao = await atualizarSkillUsuario(usuarioId, skillId, {
        nivel,
        anosExperiencia,
      });
      res.json(relacao);
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  "/:usuarioId/:skillId",
  checkOwnerOrAdmin((req) => Number(req.params.usuarioId)),
  async (req, res, next) => {
    try {
      const usuarioId = Number(req.params.usuarioId);
      const skillId = Number(req.params.skillId);
      await deletarSkillUsuario(usuarioId, skillId);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  },
);

export default router;