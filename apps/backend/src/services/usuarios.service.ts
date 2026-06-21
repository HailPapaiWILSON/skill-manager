import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { usuarios } from "../db/schema.js";
import { normalizarTexto } from "../utils/string.js";

export async function listarUsuarios() {
  const resultados = await db.query.usuarios.findMany({
    with: {
      equipe: true,
    },
  });

  return resultados.map(({ senhaHash, ...usuario }) => usuario);
}

export async function obterUsuarioPorId(id: number) {
  const resultado = await db.query.usuarios.findFirst({
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

  if (!resultado) {
    return undefined;
  }

  const { senhaHash, ...usuario } = resultado;
  return usuario;
}

export async function atualizarPerfilUsuario(
  id: number,
  nome: string,
  bio: string,
) {
  const [usuario] = await db
    .update(usuarios)
    .set({
      nome: normalizarTexto(nome),
      bio: normalizarTexto(bio),
    })
    .where(eq(usuarios.id, id))
    .returning({
      id: usuarios.id,
      nome: usuarios.nome,
      email: usuarios.email,
      bio: usuarios.bio,
      funcao: usuarios.funcao,
      equipeId: usuarios.equipeId,
    });
}

export async function atualizarBioUsuario(id: number, bio: string) {
  return await db
    .update(usuarios)
    .set({ bio: normalizarTexto(bio) })
    .where(eq(usuarios.id, id))
    .returning({
      id: usuarios.id,
      nome: usuarios.nome,
      bio: usuarios.bio,
    });
}
