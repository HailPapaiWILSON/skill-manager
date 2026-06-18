import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { usuarios } from "../db/schema.js";

export async function listarUsuarios() {
  const resultados = await db.query.usuarios.findMany({
    with: {
      equipe: true,
    },
  });

  return resultados.map(({ senhaHash, ...usuario }) => usuarios);
}

export async function obterUsuarioPorId(id: number) {
  const resultados = await db.query.usuarios.findFirst({
    where: eq(usuarios.id, id),
    with: {
      equipe: true,
      skills: {
        with: {
          skill: true,
        },
      },
    },
  });

  if (!resultados) {
    return undefined;
  }

  const { senhaHash, ...usuario } = resultados;
  return usuario;
}

export async function atualizarBioUsuario(id: number, bio: string) {
  return await db
    .update(usuarios)
    .set({ bio })
    .where(eq(usuarios.id, id))
    .returning();
}