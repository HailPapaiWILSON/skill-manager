# DER

### Tabela: Usuários

* id INT PK AUTO
* nome VARCHAR(150)
* email VARCHAR(255) UNIQUE
* bio TEXT
* cargo VARCHAR(100)
* role ENUM
* equipe_id INT FK

### Tabela: Equipes

* id INT PK AUTO
* nome VARCHAR(120)
* descricao TEXT

### Tabela: Tipos de Skill

* id INT PK AUTO
* nome VARCHAR(100)

### Tabela: Skill

* id INT PK AUTO
* nome VARCHAR(120)
* categoria_id INT FK

### Tabela: Skill dos Usuarios

* usuario_id INT FK
* skill_id INT FK
* nivel ENUM
* anos_experiencia INT

### Tabela: Projetos

* id INT PK AUTO
* nome VARCHAR(150)
* descricao TEXT
* status ENUM

### Tabela: Skill de Projeto

* projeto_id INT FK
* skill_id INT FK

### Tabela: Convites

* id INT PK AUTO
* codigo VARCHAR(100)
* email VARCHAR(255)
* equipe_id INT FK
* criado_por INT FK
* expira_em TIMESTAMP
* usado_em TIMESTAMP DEFAULT NULL
