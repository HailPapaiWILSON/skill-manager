import { and, eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { usuarios, skills, skillsUsuarios } from "../db/schema.js";

export type NivelSkill = "junior" | "pleno" | "senior";

export type CreateUserSkillInput = {
  usuarioId: number;
  skillId: number;
  nivel: NivelSkill;
  anosExperiencia?: number;
};

export type UpdateUserSkillInput = {
  nivel?: NivelSkill;
  anosExperiencia?: number;
};

export async function listUserSkills() {
  return db.query.skillsUsuarios.findMany({
    with: {
      usuario: true,
      skill: true,
    },
  });
}

export async function getUserSkill(usuarioId: number, skillId: number) {
  return db.query.skillsUsuarios.findFirst({
    where: and(
      eq(skillsUsuarios.usuarioId, usuarioId),
      eq(skillsUsuarios, skillId),
    ),
    with: {
      usuario: true,
      skill: true,
    },
  });
}

export async function createUserSkill(input: CreateUserSkillInput) {
  const usuario = await db.query.usuarios.findFirst({
    where: eq(usuarios.id, input.usuarioId),
  });

  if (!usuario) {
    throw new Error("usuario nao encontrada");
  }

  const skill = await db.query.skills.findFirst({
    where: eq(skills.id, input.skillId),
  });

  if (!skill) {
    throw new Error("Skill nao encontrada");
  }

  const existing = await getUserSkill(input.usuarioId, input.skillId);

  if (existing) {
    throw new Error("Usuario ja possui essa skill");
  }

  const [userSkill] = await db
    .insert(skillsUsuarios)
    .values({
      usuarioId: input.usuarioId,
      skillId: input.skillId,
      nivel: input.nivel,
      anosExperiencia: input.anosExperiencia ?? 0,
    })
    .returning();

  return userSkill;
}

export async function updateUserSkill(
  usuarioId: number,
  skillId: number,
  input: UpdateUserSkillInput,
) {
  const relation = await getUserSkill(usuarioId, skillId);

  if (!relation) {
    throw new Error("Relaçao encontrada");
  }

  const [updated] = await db
    .update(skillsUsuarios)
    .set({
      ...(input.nivel && {
        nivel: input.nivel,
      }),

      ...(input.anosExperiencia !== undefined && {
        anosExperiencia: input.anosExperiencia,
      }),
    })
    .where(
      and(
        eq(skillsUsuarios.usuarioId, usuarioId),
        eq(skillsUsuarios.skillId, skillId),
      ),
    )
    .returning();

  return updated;
}

export async function deleteUserSkill(usuarioId: number, skillId: number) {
  const relation = await getUserSkill(usuarioId, skillId);

  if (!relation) {
    throw new Error("Relaçao não encontrada");
  }

  const [deleted] = await db
    .delete(skillsUsuarios)
    .where(
      and(
        eq(skillsUsuarios.usuarioId, usuarioId),
        eq(skillsUsuarios.skillId, skillId),
      ),
    )
    .returning();

  return deleted;
}
  
