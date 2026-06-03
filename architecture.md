  # Arquitetura e Decisões de Projeto

## Objetivo e Evolução
O projeto nasceu do desejo de criar uma aplicação orientada a dados que fosse além de um CRUD genérico. A ideia evoluiu de um simples banco de dados para uma plataforma de inteligência técnica organizacional.

## Decisões Chave

### 1. Foco Técnico (Non-RH)
O sistema não lida com dados sensíveis de RH (salários, documentos, folha de pagamento). O foco é estritamente em competências e engenharia.

### 2. Single-Organization
Desenhado para ser utilizado por uma única organização, simplificando a gestão de permissões e o escopo de analytics.

### 3. Níveis de Acesso
- USER: Gerencia seu próprio perfil e visualiza dashboards.
- ADMIN: Gerencia equipes, catálogo de skills e convites.

### 4. Ciclo de Vida do Usuário
- Convites: Admins geram códigos vinculados a equipes específicas.
- Limpeza Automática: Usuários sem equipe definida por longos períodos podem ser removidos para manter a integridade dos dados.

## Modelagem de Dados
A estrutura foi otimizada para consultas analíticas complexas e JOINs eficientes.
- Veja o Diagrama de Entidade e Relacionamento (DER) em der.md.
