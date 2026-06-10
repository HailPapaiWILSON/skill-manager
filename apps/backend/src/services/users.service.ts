import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { usuarios, equipes } from "../db/schema.js";

import {
  normalizeCode,
  normalizeEmail,
  normalizeText,
} from "../utils/string.js";

type CreateUserInput = {
  nome: string;
  email: string;
  senhaHash: string;
  codigoIngresso: string;
};

type UpdateUserInput = {
  nome?: string;
  email?: string;
  bio?: string | null;
};

export async function createUser(input: CreateUserInput) {
  const nome = normalizeText(input.nome);
  const email = normalizeEmail(input.email);
  const codigoIngresso = normalizeCode(input.codigoIngresso);

  const equipe = await db.query.equipes.findFirst({
    where: eq(equipes.codigoIngresso, codigoIngresso),
  });

  if (!equipe) {
    throw new Error("Código de ingresso inválido");
  }

  const [usuario] = await db
    .insert(usuarios)
    .values({
      nome,
      email,
      senhaHash: input.senhaHash,
      equipeId: equipe.id,
    })
    .returning();
}

export async function listUsers() {
  return await db.query.usuarios.findMany({
    with: {
      equipe: true,
    },
  });
}

export async function getUserById(id: number) {
  return await db.query.usuarios.findFirst({
    where: eq(usuarios.id, id),
    with: {
      equipe: true,
      skills: {
        with: {
          skill: true,
        },
      },
    },
  });
}

export async function updateUser(id: number, input: UpdateUserInput) {
  const data: Partial<typeof usuarios.$inferInsert> = {};

  if (input.nome !== undefined) {
    data.nome = normalizeText(input.nome);
  }

  if (input.email !== undefined) {
    data.email = normalizeEmail(input.email);
  }

  if (input.bio !== undefined) {
    data.bio = input.bio?.trim() ?? null;
  }

  const [user] = await db
    .update(usuarios)
    .set(data)
    .where(eq(usuarios.id, id))
    .returning();

  return user;
}

export async function deleteUser(id: number) {
  await db
    .delete(usuarios)
    .where(eq(usuarios.id, id));
}
