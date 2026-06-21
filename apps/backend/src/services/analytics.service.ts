import { db } from "../db/index.js";
import {
  usuarios,
  equipes,
  skills,
  skillsUsuarios,
  skillsProjeto,
  projetos,
  categoriasSkills,
} from "../db/schema.js";

import { eq, sql, and, desc, asc, notInArray, count, avg } from "drizzle-orm";

export async function buscarEspecialistas(skillId: number, nivel?: string) {
  const conditions = [eq(skillsUsuarios.skillId, skillId)];

  if (nivel) {
    conditions.push(eq(skillsUsuarios.nivel, nivel as any));
  }

  return db
    .select({
      id: usuarios.id,
      nome: usuarios.nome,
      email: usuarios.email,
      equipe: equipes.nome,
      nivel: skillsUsuarios.nivel,
      anosExperiencia: skillsUsuarios.anosExperiencia,
    })
    .from(skillsUsuarios)
    .innerJoin(usuarios, eq(usuarios.id, skillsUsuarios.usuarioId))
    .innerJoin(equipes, eq(equipes.id, usuarios.equipeId))
    .where(and(...conditions))
    .orderBy(desc(skillsUsuarios.anosExperiencia), asc(usuarios.nome));
}

export async function obterHeatmap() {
  return db
    .select({
      equipeId: equipes.id,
      nome: equipes.nome,
      skillId: skills.id,
      skill: skills.nome,
      totalEspecialistas: count(skillsUsuarios.usuarioId),
      nivelMedio: sql<number>`ROUND(avg(
        CASE ${skillsUsuarios.nivel}
          WHEN 'junior' THEN 1
          WHEN 'pleno' THEN 2
          WHEN 'senior' THEN 3
        END
      ), 1)`.as("nivelMedio"),
    })
    .from(skillsUsuarios)
    .innerJoin(usuarios, eq(usuarios.id, skillsUsuarios.usuarioId))
    .innerJoin(equipes, eq(equipes.id, usuarios.equipeId))
    .innerJoin(skills, eq(skills.id, skillsUsuarios.skillId))
    .groupBy(equipes.id, skills.id)
    .orderBy(asc(equipes.nome), asc(skills.nome));
}

export async function obterRiscoTecnico(threshold: number = 2) {
  return db
    .select({
      id: skills.id,
      skill: skills.nome,
      totalEspecialistas: count(skillsUsuarios.usuarioId),
    })
    .from(skills)
    .leftJoin(skillsUsuarios, eq(skillsUsuarios.skillId, skills.id))
    .groupBy(skills.id)
    .having(sql`COUNT(${skillsUsuarios.usuarioId}) <= ${threshold}`)
    .orderBy(asc(count(skillsUsuarios.usuarioId)), asc(skills.nome));
}

export async function obterGapsDaEquipe(equipeId: number) {
  const skillsExistentes = await db
    .select({
      id: skills.id,
    })
    .from(skillsUsuarios)
    .innerJoin(usuarios, eq(usuarios.id, skillsUsuarios.usuarioId))
    .innerJoin(skills, eq(skills.id, skillsUsuarios.skillId))
    .where(eq(usuarios.equipeId, equipeId));

  const idsExistentes = skillsExistentes.map((s) => s.id);

  return db
    .selectDistinct({
      id: skills.id,
      skill: skills.nome,
      categoria: categoriasSkills.nome,
    })
    .from(skillsProjeto)
    .innerJoin(projetos, eq(projetos.id, skillsProjeto.projetoId))
    .innerJoin(skills, eq(skills.id, skillsProjeto.skillId))
    .leftJoin(categoriasSkills, eq(categoriasSkills.id, skills.categoriaId))
    .where(
      and(
        eq(projetos.equipeId, equipeId),
        idsExistentes.length > 0
          ? notInArray(skills.id, idsExistentes)
          : sql`1=1`,
      ),
    )
    .orderBy(asc(categoriasSkills.nome), asc(skills.nome));
}
