import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { categoriasSkills } from "../db/schema.js";
import { normalizarTexto } from "../utils/string.js";

type CriarCategoriaInput = {
  nome: string;
};

type AtualizarCategoriaInput = {
  nome?: string;
};

export async function listarCategorias() {
  return await db.query.categoriasSkills.findMany();
}

export async function obterCategoriaPorId(id: number) {
  return await db.query.categoriasSkills.findFirst({
    where: eq(categoriasSkills.id, id),
  });
}

export async function criarCategoria(input: CriarCategoriaInput) {
  const [categoria] = await db
    .insert(categoriasSkills)
    .values({ nome: normalizarTexto(input.nome) })
    .returning();

  return categoria;
}

export async function atualizarCategoria(
  id: number,
  input: AtualizarCategoriaInput,
) {
  const dados: Partial<typeof categoriasSkills.$inferInsert> = {};

  if (input.nome !== undefined) {
    dados.nome = normalizarTexto(input.nome);
  }

  const [categoria] = await db
    .update(categoriasSkills)
    .set(dados)
    .where(eq(categoriasSkills.id, id))
    .returning();

  return categoria;
}

export async function deletarCategoria(id: number) {
  await db.delete(categoriasSkills).where(eq(categoriasSkills.id, id));
}
