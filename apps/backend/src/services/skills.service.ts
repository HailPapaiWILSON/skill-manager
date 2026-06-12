import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { categoriasSkills } from "../db/schema.js";
import { normalizeText } from "../utils/string.js";

export async function listSkill() {
  return db.query.skills.findMany({
    with: {
      categoria: true,
    },
  });
}

// export async function getSkillById(id: number) {}
// export async function createSkill(data: CreateSkillInput) {}
// export async function updateSkill() {id: number, input: UpdateSkillInput}
// export async function deleteSkill(id: number)

