# Guia de Instalação e Execução

Este guia explica como configurar e executar o Skill Manager em seu ambiente local. O projeto é composto por dois repositórios independentes que precisam ser executados simultaneamente:

- **Backend:** [skill-manager](https://github.com/HailPapaiWILSON/skill-manager)
- **Frontend:** [skill-manager-frontend](https://github.com/HailPapaiWILSON/skill-manager-frontend)

## Pré-requisitos

Antes de começar, certifique-se de ter instalado em seu sistema:

- **Node.js**
- **SQLite**

## 1. Configuração do Backend

### 1.1 Clonar o repositório

```
git clone https://github.com/HailPapaiWILSON/skill-manager.git
cd skill-manager
```

### 1.2 Instalar dependências

```
npm install
```

### 1.3 Configurar o banco de dados

```
npm run db:push
npm run seed
```

### 1.4 Executar o servidor

```
npm run dev
```

O backend estará disponível em `http://localhost:3000`.

## 2. Configuração do Frontend

### 2.1 Clonar o repositório

```
git clone https://github.com/HailPapaiWILSON/skill-manager-frontend.git
cd skill-manager-frontend
```

### 2.2 Instalar dependências

```
npm install
```

### 2.3 Executar o frontend

npm run dev

O frontend estará disponível em `http://localhost:5173`.

## 3. Verificação da Instalação

1. Acesse `http://localhost:5173` no navegador.
2. Faça login com uma das contas criadas durante o seed (ou cadastre-se).
3. Navegue pelas funcionalidades para confirmar que tudo está funcionando.

## 4. Comandos Úteis

### Backend

| Comando | Descrição |
|---------|-----------|
| npm run dev | Executa o backend com hot-reload |
| npm run db:generate | Gera arquivos de migração a partir do schema |
| npm run db:push | Aplica as migrações ao banco de dados |
| npm run seed | Popula o banco com dados iniciais |

### Frontend

| Comando | Descrição |
|---------|-----------|
| npm run dev | Executa o frontend em desenvolvimento |
