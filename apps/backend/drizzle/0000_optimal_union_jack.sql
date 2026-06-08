CREATE TABLE `categorias_skills` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nome` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categorias_skills_nome_unique` ON `categorias_skills` (`nome`);--> statement-breakpoint
CREATE TABLE `equipes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nome` text NOT NULL,
	`descricao` text,
	`codigo_ingresso` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `equipes_nome_unique` ON `equipes` (`nome`);--> statement-breakpoint
CREATE UNIQUE INDEX `equipes_codigo_ingresso_unique` ON `equipes` (`codigo_ingresso`);--> statement-breakpoint
CREATE TABLE `projetos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nome` text NOT NULL,
	`descricao` text,
	`status` text DEFAULT 'planejado' NOT NULL,
	`equipe_id` integer NOT NULL,
	FOREIGN KEY (`equipe_id`) REFERENCES `equipes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `projetos_nome_unique` ON `projetos` (`nome`);--> statement-breakpoint
CREATE TABLE `skills` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nome` text NOT NULL,
	`categoria_id` integer NOT NULL,
	FOREIGN KEY (`categoria_id`) REFERENCES `categorias_skills`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `skills_nome_unique` ON `skills` (`nome`);--> statement-breakpoint
CREATE TABLE `skills_projeto` (
	`projeto_id` integer NOT NULL,
	`skill_id` integer NOT NULL,
	PRIMARY KEY(`projeto_id`, `skill_id`),
	FOREIGN KEY (`projeto_id`) REFERENCES `projetos`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`skill_id`) REFERENCES `skills`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `skills_usuarios` (
	`usuario_id` integer NOT NULL,
	`skill_id` integer NOT NULL,
	`nivel` text NOT NULL,
	`anos_experiencia` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`usuario_id`, `skill_id`),
	FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`skill_id`) REFERENCES `skills`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `usuarios` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nome` text NOT NULL,
	`email` text NOT NULL,
	`senha_hash` text NOT NULL,
	`bio` text,
	`role` text DEFAULT 'user' NOT NULL,
	`equipe_id` integer NOT NULL,
	`criado_em` text,
	FOREIGN KEY (`equipe_id`) REFERENCES `equipes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `usuarios_email_unique` ON `usuarios` (`email`);