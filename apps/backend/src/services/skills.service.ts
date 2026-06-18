import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { categoriasSkills, skills } from "../db/schema.js";
import { normalizarTexto } from "../utils/string.js";

export type CriarSkillInput = {
  nome: string;
  categoriaId: number;
};
export type AtualizarSkillInput = {
  nome?: string;
  categoriaId?: number;
};

export async function listarSkills() {
  return db.query.skills.findMany({
    with: {
      categoria: true,
    },
  });
}

export async function obterSkillPorId(id: number) {
  return await db.query.skills.findFirst({
    where: eq(skills.id, id),
    with: {
      categoria: true,
    },
  });
}

export async function criarSkill(input: CriarSkillInput) {
  const nome = normalizarTexto(input.nome);

  const categoria = await db.query.categoriasSkills.findFirst({
    where: eq(categoriasSkills.id, input.categoriaId),
  });

  if (!categoria) {
    throw new Error("Categoria não encontrada");
  }

  const [skill] = await db
    .insert(skills)
    .values({ nome, categoriaId: input.categoriaId })
    .returning();

  return skill;
}

export async function atualizarSkill(id: number, input: AtualizarSkillInput) {
  const skill = await obterSkillPorId(id);

  if (!skill) {
    throw new Error("Skill não encontrada");
  }

  if (input.categoriaId) {
    const categoria = await db.query.categoriasSkills.findFirst({
      where: eq(categoriasSkills.id, input.categoriaId),
    });

    if (!categoria) {
      throw new Error("Categoria nao encontrada");
    }
  }

  const [updated] = await db
    .update(skills)
    .set({
      ...(input.nome && { nome: normalizarTexto(input.nome) }),
      ...(input.categoriaId && { categoriaId: input.categoriaId }),
    })
    .where(eq(skills.id, id))
    .returning();

  return updated;
}

export async function deleteSkill(id: number) {
  const skill = await obterSkillPorId(id);

  if (!skill) {
    throw new Error("Skill não encontrada");
  }

  const [deletado] = await db
    .delete(skills)
    .where(eq(skills.id, id))
    .returning();

  return deletado;
}
