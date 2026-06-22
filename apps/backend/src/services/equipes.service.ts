import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { equipes, projetos, usuarios } from "../db/schema.js";

import {
  normalizarTexto,
  normalizarCodigo,
  gerarCodigo,
} from "../utils/string.js";

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
  return await db.query.equipes.findFirst({
    where: eq(equipes.id, id),
  });
}

export async function obterDetalhesEquipe(id: number) {
  const resultado = await db.query.equipes.findFirst({
    where: eq(equipes.id, id),
    with: {
      usuarios: {
        columns: {
          senhaHash: false,
        },
      },
      projetos: true,
    },
  });

  if (!resultado) {
    throw new Error("Equipe não encontrada");
  }

  return resultado;
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
  const possuiUsuarios = await db.query.usuarios.findFirst({
    where: eq(usuarios.equipeId, id),
  });

  if (possuiUsuarios) {
    throw new Error(
      "Não é possível deletar uma equipe que possui usuários vinculados",
    );
  }

  const possuiProjetos = await db.query.projetos.findFirst({
    where: eq(projetos.equipeId, id),
  });

  if (possuiProjetos) {
    throw new Error(
      "Não é possível deletar uma equipe que possui projetos vinculados",
    );
  }

  await db.delete(equipes).where(eq(equipes.id, id));
}
