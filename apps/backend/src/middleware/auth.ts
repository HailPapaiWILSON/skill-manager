import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface UsuarioToken {
  id: number;
  email: string;
  funcao: "usuario" | "administrador";
  equipeId: number;
}

declare global {
  namespace Express {
    interface Request {
      usuario?: UsuarioToken;
    }
  }
}

export function autenticar(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ error: "Token mal formatado" });
  }

  const token = parts[1];

  if (!token) {
    return res.status(401).json({ error: "Token not provided" });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET não configurado");
  }

  try {
    const decoded = jwt.verify(token, secret) as UsuarioToken;

    req.usuario = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}
