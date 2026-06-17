import { and, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { projetos, skills, skillsProjeto } from "../db/schema.js";

export type CreateProjectSkillInput = {
  projetoId: number;
  skillId: number;
};

export async function listProjectSkills() {
  return db.query.skillsProjeto.findFirst({
    with: {
      projeto: true,
      skill: true,
    },
  });
}

export async function getProjectSkill(projetoId: number, skillId: number) {
  return db.query.skillsProjeto.findMany({
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
