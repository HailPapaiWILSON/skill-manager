import { and, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { projetos, skills, skillsProjeto } from "../db/schema.js";

export type CriarSkillProjetoInput = {
  projetoId: number;
  skillId: number;
};

export async function listarSkillsProjeto() {
  return db.query.skillsProjeto.findMany({
    with: {
      projeto: true,
      skill: true,
    },
  });
}

export async function obterSkillProjeto(projetoId: number, skillId: number) {
  return db.query.skillsProjeto.findFirst({
    where: and(
      eq(skillsProjeto.projetoId, projetoId),
      eq(skillsProjeto.skillId, skillId),
    ),
    with: {
      projeto: true,
      skill: true,
    },
  });
}

export async function createProjcriarSkillProjetoectSkill(input: CriarSkillProjetoInput) {
  const projeto = await db.query.projetos.findFirst({
    where: eq(projetos.id, input.projetoId),
  });

  if (!projeto) {
    throw new Error("Projeto nao encontrado");
  }

  const skill = await db.query.skills.findFirst({
    where: eq(skills.id, input.skillId),
  });

  if (!skill) {
    throw new Error("Skill nao encontrada");
  }

  const existente = await obterSkillProjeto(input.projetoId, input.skillId);

  if (existente) {
    throw new Error("Projeto ja possui essa skill");
  }

  const [relacao] = await db
    .insert(skillsProjeto)
    .values({
      projetoId: input.projetoId,
      skillId: input.skillId,
    })
    .returning();

  return relacao;
}

export async function deletarSkillProjeto(projetoId: number, skillId: number) {
  const relacao = await obterSkillProjeto(projetoId, skillId);

  if (!relacao) {
    throw new Error("Relação não encontrada");
  }

  const [deletado] = await db
    .delete(skillsProjeto)
    .where(
      and(
        eq(skillsProjeto.projetoId, projetoId),
        eq(skillsProjeto.skillId, skillId),
      ),
    )
    .returning();

  return deletado;
}
