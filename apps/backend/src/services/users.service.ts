import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { usuarios } from "../db/schema.js";

export async function listUsers() {
  return await db.query.usuarios.findMany({
    with: {
      equipe: true,
    },
  });
}

export async function getUserById(id: number) {
  return await db.query.usuarios.findFirst({
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
}