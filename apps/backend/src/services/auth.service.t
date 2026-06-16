import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { equipes, usuarios } from "../db/schema.js";
import {
  normalizeEmail,
  normalizeText,
  normalizeCode,
} from "../utils/string.js";

export type RegisterInput = {
  nome: string;
  email: string;
  senha: string;
  codigoIngresso: string;
};

export type LoginInput = {
  email: string;
  senha: string;
};

export async function register(input: RegisterInput) {
  const nome = normalizeText(input.nome);
  const email = normalizeEmail(input.email);
  const codigoIngresso = normalizeCode(input.codigoIngresso);

  const equipe = await db.query.equipes.findFirst({
    where: eq(equipes.codigoIngresso, codigoIngresso),
  });

  if (!equipe) {
    throw new Error("Codigo de ingresso invalido");
  }

  const existingUser = await db.query.usuarios.findFirst({
    where: eq(usuarios.email, email),
  });

  if (existingUser) {
    throw new Error("Email ja cadastrado");
  }

  const senhaHash = await bcrypt.hash(input.senha, 10);

  const [user] = await db
    .insert(usuarios)
    .values({
      nome,
      email,
      senhaHash,
      equipeId: equipe.id,
      role: "user",
    })
    .returning();
  return user;
}

export async function login(input: LoginInput) {
  const email = normalizeEmail(input.email);

  const user = await db.query.usuarios.findFirst({
    where: eq(usuarios.email, email),
  });

  if (!user) {
    throw new Error("Credenciais invalidas");
  }

  const senhaValida = await bcrypt.compare(input.senha, user.senhaHash);

  if (!senhaValida) {
    throw new Error("Credenciasi Invalidas");
  }

  return user;
}
