import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { equipes, usuarios } from "../db/schema.js";

import { generateCode, normalizeCode, normalizeText } from "../utils/string.js";

type CreateTeamInput = {
  nome: string;
  descricao?: string;
  codigoIngresso?: string;
};

type UpdateTeamInput = {
  nome?: string;
  descricao?: string;
};

export async function listTeams() {
  return await db.query.equipes.findMany();
}

export async function getTeamById(id: number) {
  return await db.query.equipes.findMany({
    where: eq(equipes.id, id),
  });
}

export async function createTeam(input: CreateTeamInput) {
  const nome = normalizeText(input.nome);
  const codigoIngresso = input.codigoIngresso
    ? normalizeCode(input.codigoIngresso)
    : generateCode();

  const [team] = await db
    .insert(equipes)
    .values({
      nome,
      descricao: input.descricao,
      codigoIngresso,
    })
    .returning();

  return team;
}

export async function updateTeam(id: number, input: UpdateTeamInput) {
  const data: Partial<typeof equipes.$inferInsert> = {};

  if (input.nome !== undefined) {
    data.nome = normalizeText(input.nome);
  }

  if (input.descricao !== undefined) {
    data.descricao = input.descricao;
  }

  const [team] = await db
    .update(equipes)
    .set(data)
    .where(eq(equipes.id, id))
    .returning();

  return team;
}

export async function deleteTeam(id: number) {
  await db
    .delete(equipes)
    .where(eq(equipes.id, id));
}
