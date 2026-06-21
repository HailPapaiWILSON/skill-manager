import type { Request, Response, NextFunction } from "express";

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  const usuario = req.usuario;

  if (!usuario) {
    return res.status(401).json({ error: "Usuario não autenticado" });
  }

  if (usuario.funcao !== "administrador") {
    return res.status(403).json({
      error: "Acesso negado. Apenas administradores podem realizar esta ação.",
    });
  }

  next();
}
