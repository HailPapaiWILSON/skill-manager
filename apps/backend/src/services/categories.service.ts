import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { categoriasSkills } from "../db/schema.js";
import { normalizeText } from "../utils/string.js";

type CreateCategoryInput = {
  nome: string;
};

type UpdateCategoryInput = {
  nome?: string;
};

export async function listCategories() {
  return await db.query.categoriasSkills.findMany();
}

export async function getCategoryById(id: number) {
  return await db.query.categoriasSkills.findFirst({
    where: eq(categoriasSkills.id, id),
  });
}

export async function createCategory(input: CreateCategoryInput) {
  const [category] = await db
    .insert(categoriasSkills)
    .values({ nome: input.nome })
    .returning();

  return category;
}

export async function updateCategory(id: number, input: UpdateCategoryInput) {
  const data: Partial<typeof categoriasSkills.$inferInsert> = {};

  if (input.nome !== undefined) {
    data.nome = normalizeText(input.nome);
  }

  const [category] = await db
    .update(categoriasSkills)
    .set(data)
    .where(eq(categoriasSkills.id, id))
    .returning();

  return category;
}

export async function deleteCategory(id: number) {
  await db
    .delete(categoriasSkills)
    .where(eq(categoriasSkills.id, id));
}
