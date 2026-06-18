import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { categoriasSkills } from "../db/schema.js";
import { normalizarTexto } from "../utils/string.js";

type EntradaCriarCategoria = {
  nome: string;
};

type EntradaAtualizarCategoria = {
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

export async function criarCategoria(entrada: EntradaCriarCategoria) {
  const [categoria] = await db
    .insert(categoriasSkills)
    .values({ nome: entrada.nome })
    .returning();

  return categoria;
}

export async function atualizarCategoria(
  id: number,
  entrada: EntradaAtualizarCategoria,
) {
  const dados: Partial<typeof categoriasSkills.$inferInsert> = {};

  if (entrada.nome !== undefined) {
    dados.nome = normalizarTexto(entrada.nome);
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
