# Diagrama de Entidade Relacionamento

### Tabela: `equipes`

* `id`: **INTEGER** [PK, AUTO]
* `nome`: **TEXT** [NOT NULL, UNIQUE]
* `descricao`: **TEXT**
* `codigo_ingresso`: **TEXT** [NOT NULL, UNIQUE]

### Tabela: `usuarios`

* `id`: **INTEGER** [PK, AUTO]
* `nome`: **TEXT** [NOT NULL]
* `email`: **TEXT** [NOT NULL, UNIQUE]
* `senha_hash`: **TEXT** [NOT NULL]
* `bio`: **TEXT**
* `role`: **ENUM** ['user', 'admin']
* `equipe_id`: **INTEGER** [FK, NOT NULL] -> `equipes.id`
* `criado_em`: **DATETIME**

### Tabela: `categorias_skills`

* `id`: **INTEGER** [PK, AUTO]
* `nome`: **TEXT** [NOT NULL, UNIQUE]

### Tabela: `skills`

* `id`: **INTEGER** [PK, AUTO]
* `nome`: **TEXT** [NOT NULL, UNIQUE]
* `categoria_id`: **INTEGER** [FK, NOT NULL] -> `categorias_skills.id`

### Tabela: `skills_usuarios` (N:M)

* `usuario_id`: **INTEGER** [PK, FK] -> `usuarios.id`
* `skill_id`: **INTEGER** [PK, FK] -> `skills.id`
* `nivel`: **ENUM** ['junior', 'pleno', 'senior'] [NOT NULL]
* `anos_experiencia`: **INTEGER** [DEFAULT: 0]

### Tabela: `projetos`

* `id`: **INTEGER** [PK, AUTO]
* `nome`: **TEXT** [NOT NULL, UNIQUE]
* `descricao`: **TEXT**
* `status`: **ENUM** ['planejado', 'em_andamento', 'concluido', 'cancelado'] [DEFAULT: 'planejado']
* `equipe_id`: **INTEGER** [FK, NOT NULL] -> `equipes.id`

### Tabela: `skills_projeto` (N:M)

* `projeto_id`: **INTEGER** [PK, FK] -> `projetos.id`
* `skill_id`: **INTEGER** [PK, FK] -> `skills.id`
