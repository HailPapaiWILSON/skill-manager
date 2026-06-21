import type { Request, Response, NextFunction } from "express";

export function checkOwnerOrAdmin(
  getUserIdFromParams: (req: Request) => number,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const usuarioLogado = req.usuario;

    if (!usuarioLogado) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    const targetUserId = getUserIdFromParams(req);

    if (!isNaN(targetUserId)) {
      return res.status(400).json({ error: "ID de usuário inválido" });
    }

    if (
      usuarioLogado.id === targetUserId ||
      usuarioLogado.funcao === "administrador"
    ) {
      return next();
    }

    return res
      .status(403)
      .json({ error: "Sem permissão para acessar ou modificar este recurso" });
  };
}
