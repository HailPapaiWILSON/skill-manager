PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_usuarios` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nome` text NOT NULL,
	`email` text NOT NULL,
	`senha_hash` text NOT NULL,
	`bio` text,
	`funcao` text DEFAULT 'usuario' NOT NULL,
	`equipe_id` integer NOT NULL,
	`criado_em` text,
	FOREIGN KEY (`equipe_id`) REFERENCES `equipes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_usuarios`("id", "nome", "email", "senha_hash", "bio", "funcao", "equipe_id", "criado_em") SELECT "id", "nome", "email", "senha_hash", "bio", "funcao", "equipe_id", "criado_em" FROM `usuarios`;--> statement-breakpoint
DROP TABLE `usuarios`;--> statement-breakpoint
ALTER TABLE `__new_usuarios` RENAME TO `usuarios`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `usuarios_email_unique` ON `usuarios` (`email`);