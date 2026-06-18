import { and, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { projetos, skills, skillsProjeto } from "../db/schema.js";

export type CreateProjectSkillInput = {
  projetoId: number;
  skillId: number;
};

export async function listProjectSkills() {
  return db.query.skillsProjeto.findMany({
    with: {
      projeto: true,
      skill: true,
    },
  });
}

export async function getProjectSkill(projetoId: number, skillId: number) {
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

export async function createProjectSkill(input: CreateProjectSkillInput) {
  const project = await db.query.projetos.findFirst({
    where: eq(projetos.id, input.projetoId),
  });

  if (!project) {
    throw new Error("Projeto nao encontrado");
  }

  const skill = await db.query.skills.findFirst({
    where: eq(skills.id, input.skillId),
  });

  if (!skill) {
    throw new Error("Skill nao encontrada");
  }

  const existing = await getProjectSkill(input.projetoId, input.skillId);

  if (existing) {
    throw new Error("Projeto ja possui essa skill");
  }

  const [relation] = await db
    .insert(skillsProjeto)
    .values({
      projetoId: input.projetoId,
      skillId: input.skillId,
    })
    .returning();

  return relation;
}

export async function deleteProjectSkill(projectId: number, skillId: number) {
  const relation = await getProjectSkill(projectId, skillId);

  if (!relation) {
    throw new Error("Relação não encontrada");
  }

  const [deleted] = await db
    .delete(skillsProjeto)
    .where(
      and(
        eq(skillsProjeto.projetoId, projectId),
        eq(skillsProjeto.skillId, skillId),
      ),
    )
    .returning();

  return deleted;
}
