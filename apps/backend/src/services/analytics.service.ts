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
      nivelMedio: sql<number>ROUND(AVG(
        CASE ${skillUsuarios.nivel}
          WHEN 'junior' THEN 1
          WHEN 'pleno' THEN 2
          WHEN 'senior' THEN 3
        END
      ), 1).as('nivelMedio'),
    })
    .from(skillsUsuarios)
    .innerJoin(usuarios, eq(usuarios.id, skillsUsuarios.usuarioId))
    .innerJoin(equipes, eq(equipes.id, usuario.equipeId))
    .innerJoin(skills, eq(skills.id, skillsUsuarios.skillId))
    .groupBy(equipes.id, skills.id)
    .orderBy(asc(equipes.nome), asc(skills.nome));
}
