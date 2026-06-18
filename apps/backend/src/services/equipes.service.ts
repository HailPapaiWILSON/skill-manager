import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { equipes, usuarios } from "../db/schema.js";

import { normalizarTexto, normalizarCodigo, gerarCodigo } from "../utils/string.js";

type CriarEquipeInput = {
  nome: string;
  descricao?: string;
  codigoIngresso?: string;
};

type AtualizarEquipeInput = {
  nome?: string;
  descricao?: string;
};

export async function listarEquipes() {
  return await db.query.equipes.findMany();
}

export async function obterEquipePorId(id: number) {
  return await db.query.equipes.findMany({
    where: eq(equipes.id, id),
  });
}

export async function criarEquipe(input: CriarEquipeInput) {
  const nome = normalizarTexto(input.nome);
  const codigoIngresso = input.codigoIngresso
    ? normalizarCodigo(input.codigoIngresso)
    : gerarCodigo();

  const [equipe] = await db
    .insert(equipes)
    .values({
      nome,
      descricao: input.descricao,
      codigoIngresso,
    })
    .returning();

  return equipe;
}

export async function atualizarEquipe(id: number, input: AtualizarEquipeInput) {
  const dados: Partial<typeof equipes.$inferInsert> = {};

  if (input.nome !== undefined) {
    dados.nome = normalizarTexto(input.nome);
  }

  if (input.descricao !== undefined) {
    dados.descricao = input.descricao;
  }

  const [equipe] = await db
    .update(equipes)
    .set(dados)
    .where(eq(equipes.id, id))
    .returning();

  return equipe;
}

export async function deletarEquipe(id: number) {
  await db
    .delete(equipes)
    .where(eq(equipes.id, id));
}
