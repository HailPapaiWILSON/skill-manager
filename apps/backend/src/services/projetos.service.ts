import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { projetos, equipes } from "../db/schema.js";
import { normalizarTexto } from "../utils/string.js";

export type StatusProjeto =
  | "planejado"
  | "em_andamento"
  | "concluido"
  | "cancelado";

export type CriarProjetoInput = {
  nome: string;
  descricao?: string;
  status?: StatusProjeto;
  equipeId: number;
};

export type AtualizarProjetoInput = {
  nome?: string;
  descricao?: string;
  status?: StatusProjeto;
  equipeId?: number;
};

export async function listarProjetos() {
  return db.query.projetos.findMany({
    with: {
      equipe: true,
    },
  });
}

export async function obterProjetoPorId(id: number) {
  return db.query.projetos.findFirst({
    where: eq(projetos.id, id),
    with: {
      equipe: true,
    },
  });
}

export async function criarProjeto(input: CriarProjetoInput) {
  const nome = normalizarTexto(input.nome);

  const equipe = await db.query.equipes.findFirst({
    where: eq(equipes.id, input.equipeId),
  });

  if (!equipe) {
    throw new Error("Equipe não encontrada");
  }

  const [projeto] = await db
    .insert(projetos)
    .values({
      nome,
      descricao: normalizarTexto(input.descricao ?? ""),
      status: input.status ?? "planejado",
      equipeId: input.equipeId,
    })
    .returning();
}

export async function atualizarProjeto(id: number, input: AtualizarProjetoInput) {
  const projeto = await obterProjetoPorId(id);

  if (!projeto) {
    throw new Error("Projeto nao encontrado");
  }

  if (input.equipeId) {
    const equipe = await db.query.equipes.findFirst({
      where: eq(equipes.id, input.equipeId),
    });

    if (!equipe) {
      throw new Error("Equipe nao encontrado");
    }
  }

  const [atualizado] = await db
    .update(projetos)
    .set({
      ...(input.nome && {
        nome: normalizarTexto(input.nome),
      }),

      ...(input.descricao !== undefined && {
        descricao: normalizarTexto(input.descricao),
      }),

      ...(input.status && {
        status: input.status,
      }),

      ...(input.equipeId && {
        equipeId: input.equipeId,
      }),
    })
    .where(eq(projetos.id, id))
    .returning();

  return atualizado;
}

export async function deletarProjeto(id: number) {
  const projeto = await obterProjetoPorId(id);

  if (!projeto) {
    throw new Error("Projeto não encontrado");
  }

  const [deletado] = await db
    .delete(projetos)
    .where(eq(projetos.id, id))
    .returning();

  return deletado;
}