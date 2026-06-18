import { and, eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { usuarios, skills, skillsUsuarios } from "../db/schema.js";

export type NivelSkill = "junior" | "pleno" | "senior";

export type CriarSkillUsuarioInput = {
  usuarioId: number;
  skillId: number;
  nivel: NivelSkill;
  anosExperiencia?: number;
};

export type AtualizarSkillUsuarioInput = {
  nivel?: NivelSkill;
  anosExperiencia?: number;
};

export async function listarSkillsUsuario() {
  return db.query.skillsUsuarios.findMany({
    with: {
      usuario: true,
      skill: true,
    },
  });
}

export async function obterSkillUsuario(usuarioId: number, skillId: number) {
  return db.query.skillsUsuarios.findFirst({
    where: and(
      eq(skillsUsuarios.usuarioId, usuarioId),
      eq(skillsUsuarios.skillId, skillId),
    ),
    with: {
      usuario: true,
      skill: true,
    },
  });
}

export async function criarSkillUsuario(input: CriarSkillUsuarioInput) {
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

  const existente = await obterSkillUsuario(input.usuarioId, input.skillId);

  if (existente) {
    throw new Error("Usuario ja possui essa skill");
  }

  const [skillUsuario] = await db
    .insert(skillsUsuarios)
    .values({
      usuarioId: input.usuarioId,
      skillId: input.skillId,
      nivel: input.nivel,
      anosExperiencia: input.anosExperiencia ?? 0,
    })
    .returning();

  return skillUsuario;
}

export async function atualizarSkillUsuario(
  usuarioId: number,
  skillId: number,
  input: AtualizarSkillUsuarioInput,
) {
  const relacao = await obterSkillUsuario(usuarioId, skillId);

  if (!relacao) {
    throw new Error("Relaçao nao encontrada");
  }

  const [atualizado] = await db
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

  return atualizado;
}

export async function deletarSkillUsuario(usuarioId: number, skillId: number) {
  const relacao = await obterSkillUsuario(usuarioId, skillId);

  if (!relacao) {
    throw new Error("Relaçao não encontrada");
  }

  const [deletado] = await db
    .delete(skillsUsuarios)
    .where(
      and(
        eq(skillsUsuarios.usuarioId, usuarioId),
        eq(skillsUsuarios.skillId, skillId),
      ),
    )
    .returning();

  return deletado;
}
  
