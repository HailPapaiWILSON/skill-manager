import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { projetos, equipes } from "../db/schema.js";
import { normalizeText } from "../utils/string.js";

export type ProjetoStatus =
  | "planejado"
  | "em_andamento"
  | "concluido"
  | "cancelado";

export type CreateProjectInput = {
  nome: string;
  descricao?: string;
  status?: ProjetoStatus;
  equipeId: number;
};

export type UpdateProjectInput = {
  nome?: string;
  descricao?: string;
  status?: ProjetoStatus;
  equipeId?: number;
};

export async function listProjects() {
  return db.query.projetos.findMany({
    with: {
      equipe: true,
    },
  });
}

export async function getProjectById(id: number) {
  return db.query.projetos.findFirst({
    where: eq(projetos.id, id),
    with: {
      equipe: true,
    },
  });
}

export async function createProject(input: CreateProjectInput) {
  const nome = normalizeText(input.nome);

  const equipe = await db.query.equipes.findFirst({
    where: eq(equipes.id, input.equipeId),
  });

  if (!equipe) {
    throw new Error("Equipe não encontrada");
  }

  const [project] = await db
    .insert(projetos)
    .values({
      nome,
      descricao: normalizeText(input.descricao ?? ""),
      status: input.status ?? "planejado",
      equipeId: input.equipeId,
    })
    .returning();
}

// export async function updateProject(id: number, input: UpdateProjectInput) {}
// export async function deleteProject(id: number) {}
