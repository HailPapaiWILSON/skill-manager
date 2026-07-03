PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_projetos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nome` text NOT NULL,
	`descricao` text,
	`status` text DEFAULT 'em_andamento' NOT NULL,
	`equipe_id` integer NOT NULL,
	FOREIGN KEY (`equipe_id`) REFERENCES `equipes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_projetos`("id", "nome", "descricao", "status", "equipe_id") SELECT "id", "nome", "descricao", "status", "equipe_id" FROM `projetos`;--> statement-breakpoint
DROP TABLE `projetos`;--> statement-breakpoint
ALTER TABLE `__new_projetos` RENAME TO `projetos`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `projetos_nome_unique` ON `projetos` (`nome`);