import {
  sqliteTable,
  integer,
  text,
  primaryKey,
  index,
} from "drizzle-orm/sqlite-core";

import { relations } from "drizzle-orm";

// TABELAS

export const equipes = sqliteTable("equipes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nome: text("nome").notNull().unique(),
  descricao: text("descricao"),

  codigoIngresso: text("codigo_ingresso").notNull().unique(),
});

export const usuarios = sqliteTable("usuarios", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nome: text("nome").notNull(),
  email: text("email").notNull().unique(),
  senhaHash: text("senha_hash").notNull(),
  bio: text("bio"),
  funcao: text("funcao", { enum: ["usuario", "administrador"] as const })
    .notNull()
    .default("usuario"),
  equipeId: integer("equipe_id")
    .notNull()
    .references(() => equipes.id),
  criadoEm: text("criado_em").$defaultFn(() => new Date().toISOString()),
});

export const categoriasSkills = sqliteTable("categorias_skills", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nome: text("nome").notNull().unique(),
});

export const skills = sqliteTable("skills", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nome: text("nome").notNull().unique(),
  categoriaId: integer("categoria_id")
    .notNull()
    .references(() => categoriasSkills.id),
});

export const skillsUsuarios = sqliteTable(
  "skills_usuarios",
  {
    usuarioId: integer("usuario_id")
      .notNull()
      .references(() => usuarios.id),
    skillId: integer("skill_id")
      .notNull()
      .references(() => skills.id),
    nivel: text("nivel", {
      enum: ["junior", "pleno", "senior"] as const,
    }).notNull(),
    anosExperiencia: integer("anos_experiencia").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.usuarioId, t.skillId] })],
);

export const projetos = sqliteTable("projetos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nome: text("nome").notNull().unique(),
  descricao: text("descricao"),
  status: text("status", {
    enum: ["planejado", "em_andamento", "concluido", "cancelado"] as const,
  })
    .notNull()
    .default("em_andamento"),
  equipeId: integer("equipe_id")
    .notNull()
    .references(() => equipes.id),
});

export const skillsProjeto = sqliteTable(
  "skills_projeto",
  {
    projetoId: integer("projeto_id")
      .notNull()
      .references(() => projetos.id),
    skillId: integer("skill_id")
      .notNull()
      .references(() => skills.id),
  },
  (t) => [primaryKey({ columns: [t.projetoId, t.skillId] })],
);

// INDEX

export const usuariosEquipeIdx = index("usuarios_equipe_idx").on(
  usuarios.equipeId,
);
export const projetosEquipeIdx = index("projetos_equipe_idx").on(
  projetos.equipeId,
);
export const skillDosUsuariosNivelIdx = index("skill_nivel_idx").on(
  skillsUsuarios.nivel,
);
export const skillsNomeIdx = index("skills_nome_idx").on(skills.nome);
export const skillUsuarioSkillIdx = index("skill_usuario_skill_idx").on(
  skillsUsuarios.skillId,
);
export const skillsCategoriaIdx = index("skills_categoria_idx").on(
  skills.categoriaId,
);

// RELAÇOES

export const equipesRelacoes = relations(equipes, ({ many }) => ({
  usuarios: many(usuarios),
  projetos: many(projetos),
}));

export const usuariosRelacoes = relations(usuarios, ({ one, many }) => ({
  equipe: one(equipes, {
    fields: [usuarios.equipeId],
    references: [equipes.id],
  }),
  skills: many(skillsUsuarios),
}));

export const categoriasSkillsRelacoes = relations(
  categoriasSkills,
  ({ many }) => ({
    skills: many(skills),
  }),
);

export const skillsRelacoes = relations(skills, ({ one, many }) => ({
  categoria: one(categoriasSkills, {
    fields: [skills.categoriaId],
    references: [categoriasSkills.id],
  }),
  usuarios: many(skillsUsuarios),
  projetos: many(skillsProjeto),
}));

export const skillsUsuariosRelacoes = relations(skillsUsuarios, ({ one }) => ({
  usuario: one(usuarios, {
    fields: [skillsUsuarios.usuarioId],
    references: [usuarios.id],
  }),
  skill: one(skills, {
    fields: [skillsUsuarios.skillId],
    references: [skills.id],
  }),
}));

export const projetosRelacoes = relations(projetos, ({ one, many }) => ({
  equipe: one(equipes, {
    fields: [projetos.equipeId],
    references: [equipes.id],
  }),
  skills: many(skillsProjeto),
}));

export const skillsProjetoRelacoes = relations(skillsProjeto, ({ one }) => ({
  projeto: one(projetos, {
    fields: [skillsProjeto.projetoId],
    references: [projetos.id],
  }),
  skill: one(skills, {
    fields: [skillsProjeto.skillId],
    references: [skills.id],
  }),
}));
