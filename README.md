# Skill Manager

# Visão Geral

Sistema web fullstack voltado para visualização, organização e análise de competências técnicas em equipes de tecnologia.

O objetivo do projeto é funcionar como um mapa técnico organizacional, permitindo identificar distribuição de conhecimento, especialistas, dependências críticas e métricas técnicas dentro da organização.

---

## Funcionalidades

### Usuários

Os usuários podem:

- Criar conta
- Editar perfil
- Adicionar habilidades técnicas
- Definir nível de domínio por skill
- Visualizar equipes, projetos e dashboards

### Equipes

O sistema organiza usuários em equipes como:

- Backend
- Frontend
- DevOps
- Mobile

As equipes permitem:

- Comparar competências
- Detectar gaps técnicos
- Gerar métricas
- Identificar especializações

### Skills

As skills são globais e padronizadas.

Exemplos:

- React
- Java
- Docker
- Kubernetes
- PostgreSQL

Isso evita:

- Duplicidade
- Nomes inconsistentes
- Problemas em analytics

### Categorias de Skills

As skills são agrupadas por categorias.

#### Frontend

- React
- Vue
- TypeScript

#### Backend

- Java
- Spring
- Node.js

#### DevOps

- Docker
- Kubernetes
- Linux

### Projetos

Projetos podem possuir múltiplas tecnologias relacionadas.

Exemplo:

#### Projeto

- API Gateway

#### Skills Relacionadas

- Java
- Docker
- PostgreSQL

Isso permite:

- Mapear stacks
- Relacionar tecnologias e equipes
- Detectar dependências críticas

---

# Funcionalidades Analíticas

## Dashboard Geral

O sistema fornece dashboards com:

- Skills mais dominadas
- Distribuição de conhecimento
- Tecnologias mais utilizadas
- Equipes mais fortes por categoria

## Heatmaps

| Skill  | Backend | Frontend | DevOps |
| ------- | -------- | --------- | ------- |
| React   | 1        | 8         | 0       |
| Docker  | 3        | 1         | 7       |
| SQL     | 6        | 2         | 2       |

## Busca de Especialistas

Exemplos de consultas:

```sql
Quem possui React >= 4 e Docker >= 3?
```

```sql
Quem possui maior experiência em Kubernetes?
```

## Comparação Entre Equipes

Exemplo:

- Frontend domina React
- Infra domina Docker
- Backend possui pouca experiência em testes automatizados

## Detecção de Risco Técnico

O sistema identifica tecnologias críticas com baixa redundância de especialistas.

Exemplo:

```txt
"Kubernetes depende de apenas 1 especialista"
```

Isso permite detectar:

- Dependência técnica perigosa
- Concentração excessiva de conhecimento
- Falta de redundância técnica

## Sugestão de Mentores

O sistema pode sugerir:

- Especialistas internos
- Possíveis mentores
- Pessoas com maior domínio em determinada tecnologia

---

# Evolução da Ideia

## Objetivo Inicial

Criar um sistema com banco de dados que não fosse apenas um CRUD genérico.

Objetivos:

- Resolver um problema real
- Trabalhar com modelagem relacional
- Utilizar analytics
- Fazer sentido em ambientes reais

## Evolução do Conceito

O projeto evoluiu de:

```txt
"Um sistema com banco de dados que não fosse um CRUD genérico"
```

Para:

```txt
"Uma plataforma de visualização e análise de competências técnicas organizacionais"
```

---

# Decisões Arquiteturais

## Escopo Não Relacionado a RH

O sistema NÃO inclui:

- Salários
- CPF
- Folha de pagamento
- Avaliações corporativas
- Dados sensíveis

O foco permanece em:

- Competências técnicas
- Equipes
- Projetos
- Analytics organizacionais

## Não Multiempresa

O sistema assume:

```txt
"Uma única organização utilizando o sistema"
```

Motivos:

- Simplificação arquitetural
- Foco em analytics
- Menor complexidade de permissões

## Sistema de Permissões

### USER

Permissões:

- Editar perfil
- Adicionar skills
- Visualizar dashboards
- Visualizar equipes e projetos

### ADMIN

Permissões:

- Criar equipes
- Gerenciar skills
- Mover usuários
- Remover usuários
- Gerar convites

## Cadastro Livre + Convites

### Cadastro Livre

Usuário cria conta e posteriormente:

- Monta perfil
- Adiciona skills
- Explora dashboards

### Convites

Admins podem gerar convites.

Exemplo:

```txt
Código: XPT92A
Equipe: Backend
```

## Expiração de Usuários Sem Equipe

Usuários sem equipe podem ser removidos automaticamente após determinado período.

Objetivos:

- Evitar contas abandonadas
- Reduzir poluição do sistema
- Melhorar organização

## Skills Globais

Usuários NÃO criam skills livremente.

Benefícios:

- Padronização
- Melhor analytics
- Heatmaps corretos
- Rankings consistentes

Problema evitado:

```txt
React
react
ReactJS
react.js
```

---

# Estrutura do Banco de Dados

A modelagem do banco de dados foi planejada para suportar consultas analíticas e relacionamentos complexos entre usuários, competências e projetos.

- [Acesse o Diagrama de Entidade e Relacionamento (DER)](./der.md)

---

# Tecnologias Planejadas

## Frontend

- React
- Dashboards
- Gráficos
- Tabelas dinâmicas

Bibliotecas possíveis:

- Recharts
- TanStack Table
- shadcn/ui

## Backend

- API REST
- Autenticação
- Queries analíticas
- Regras organizacionais

## Banco de Dados

- SQLite

Responsável por:

- Relacionamentos
- Métricas
- Agregações
- Analytics

---

# Potencial do Projeto

O projeto possui potencial por:

- Resolver um problema organizacional real
- Possuir modelagem relacional forte
- Trabalhar com dashboards úteis
- Permitir consultas complexas
- Fazer sentido em ambientes reais

Também demonstra conhecimentos em:

- SQL avançado
- JOINs
- Agregações
- Modelagem relacional
- Visualização de dados
- Frontend analítico

---

# Núcleo do Projeto

O sistema gira em torno de:

- Pessoas
- Skills
- Equipes
- Projetos
- Distribuição de conhecimento técnico
