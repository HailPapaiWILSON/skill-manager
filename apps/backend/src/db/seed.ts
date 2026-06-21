import { db } from "./index.js";

import {
  equipes,
  usuarios,
  skills,
  categoriasSkills,
  projetos,
  skillsProjeto,
  skillsUsuarios,
} from "./schema.js";

import bcrypt from "bcrypt";

const equipesData = [
  { nome: "Backend", codigoIngresso: "BACK098" },
  { nome: "Frontend", codigoIngresso: "FRO098" },
  { nome: "DevOps", codigoIngresso: "DEV098" },
  { nome: "Mobile", codigoIngresso: "MOB098" },
];

const categoriasData = [
  { nome: "Frontend" },
  { nome: "Backend" },
  { nome: "DevOps" },
  { nome: "Mobile" },
  { nome: "Database" },
  { nome: "Cloud" },
];

const skillsData = [
  // Frontend
  { nome: "React", categoriaId: 1 },
  { nome: "Vue.js", categoriaId: 1 },
  { nome: "Angular", categoriaId: 1 },
  { nome: "TypeScript", categoriaId: 1 },
  { nome: "CSS", categoriaId: 1 },
  // Backend
  { nome: "Node.js", categoriaId: 2 },
  { nome: "Python", categoriaId: 2 },
  { nome: "Java", categoriaId: 2 },
  { nome: "C#", categoriaId: 2 },
  { nome: "PHP", categoriaId: 2 },
  { nome: "Go", categoriaId: 2 },
  // DevOps
  { nome: "Docker", categoriaId: 3 },
  { nome: "Kubernetes", categoriaId: 3 },
  { nome: "AWS", categoriaId: 3 },
  { nome: "Terraform", categoriaId: 3 },
  { nome: "GitLab CI", categoriaId: 3 },
  // Mobile
  { nome: "React Native", categoriaId: 4 },
  { nome: "Flutter", categoriaId: 4 },
  { nome: "Swift", categoriaId: 4 },
  { nome: "Kotlin", categoriaId: 4 },
  // Database
  { nome: "PostgreSQL", categoriaId: 5 },
  { nome: "MongoDB", categoriaId: 5 },
  { nome: "Redis", categoriaId: 5 },
  { nome: "MySQL", categoriaId: 5 },
  // Cloud
  { nome: "Azure", categoriaId: 6 },
  { nome: "GCP", categoriaId: 6 },
  { nome: "Heroku", categoriaId: 6 },
];

const usuariosData = [
  {
    nome: "Ana Silva",
    email: "ana@empresa.com",
    senha: "senha123",
    bio: "Especialista em back-end com 5 anos de experiência",
    funcao: "administrador" as const,
    equipeNome: "Backend",
  },
  {
    nome: "Carlos Santos",
    email: "carlos@empresa.com",
    senha: "senha123",
    bio: "Desenvolvedor fullstack apaixonado por React",
    funcao: "usuario" as const,
    equipeNome: "Frontend",
  },
  {
    nome: "Mariana Oliveira",
    email: "mariana@empresa.com",
    senha: "senha123",
    bio: "DevOps engineer com foco em AWS e Kubernetes",
    funcao: "usuario" as const,
    equipeNome: "DevOps",
  },
  {
    nome: "João Pereira",
    email: "joao@empresa.com",
    senha: "senha123",
    bio: "Mobile developer especialista em React Native",
    funcao: "usuario" as const,
    equipeNome: "Mobile",
  },
  {
    nome: "Beatriz Lima",
    email: "beatriz@empresa.com",
    senha: "senha123",
    bio: "Backend developer com foco em Node.js e Python",
    funcao: "usuario" as const,
    equipeNome: "Backend",
  },
  {
    nome: "Rafael Costa",
    email: "rafael@empresa.com",
    senha: "senha123",
    bio: "Frontend developer expert em TypeScript e React",
    funcao: "usuario" as const,
    equipeNome: "Frontend",
  },
  {
    nome: "Fernanda Alves",
    email: "fernanda@empresa.com",
    senha: "senha123",
    bio: "Engenheira de dados com experiência em PostgreSQL",
    funcao: "usuario" as const,
    equipeNome: "Backend",
  },
  {
    nome: "Lucas Martins",
    email: "lucas@empresa.com",
    senha: "senha123",
    bio: "Especialista em mobile com Flutter e Kotlin",
    funcao: "usuario" as const,
    equipeNome: "Mobile",
  },
  {
    nome: "Camila Rocha",
    email: "camila@empresa.com",
    senha: "senha123",
    bio: "DevOps com experiência em AWS e Terraform",
    funcao: "usuario" as const,
    equipeNome: "DevOps",
  },
  {
    nome: "Thiago Souza",
    email: "thiago@empresa.com",
    senha: "senha123",
    bio: "Fullstack developer com foco em Node.js e React",
    funcao: "usuario" as const,
    equipeNome: "Frontend",
  },
];

const skillsUsuariosData = [
  // Ana (Backend)
  {
    usuarioNome: "Ana Silva",
    skillNome: "Node.js",
    nivel: "senior" as const,
    anos: 5,
  },
  {
    usuarioNome: "Ana Silva",
    skillNome: "Python",
    nivel: "senior" as const,
    anos: 4,
  },
  {
    usuarioNome: "Ana Silva",
    skillNome: "PostgreSQL",
    nivel: "senior" as const,
    anos: 5,
  },
  {
    usuarioNome: "Ana Silva",
    skillNome: "Docker",
    nivel: "pleno" as const,
    anos: 3,
  },
  // Carlos (Frontend)
  {
    usuarioNome: "Carlos Santos",
    skillNome: "React",
    nivel: "senior" as const,
    anos: 4,
  },
  {
    usuarioNome: "Carlos Santos",
    skillNome: "TypeScript",
    nivel: "senior" as const,
    anos: 4,
  },
  {
    usuarioNome: "Carlos Santos",
    skillNome: "CSS",
    nivel: "pleno" as const,
    anos: 3,
  },
  {
    usuarioNome: "Carlos Santos",
    skillNome: "Node.js",
    nivel: "pleno" as const,
    anos: 2,
  },
  // Mariana (DevOps)
  {
    usuarioNome: "Mariana Oliveira",
    skillNome: "Docker",
    nivel: "senior" as const,
    anos: 5,
  },
  {
    usuarioNome: "Mariana Oliveira",
    skillNome: "Kubernetes",
    nivel: "senior" as const,
    anos: 4,
  },
  {
    usuarioNome: "Mariana Oliveira",
    skillNome: "AWS",
    nivel: "senior" as const,
    anos: 5,
  },
  {
    usuarioNome: "Mariana Oliveira",
    skillNome: "Terraform",
    nivel: "pleno" as const,
    anos: 3,
  },
  {
    usuarioNome: "Mariana Oliveira",
    skillNome: "Python",
    nivel: "pleno" as const,
    anos: 2,
  },
  // João (Mobile)
  {
    usuarioNome: "João Pereira",
    skillNome: "React Native",
    nivel: "senior" as const,
    anos: 4,
  },
  {
    usuarioNome: "João Pereira",
    skillNome: "TypeScript",
    nivel: "pleno" as const,
    anos: 3,
  },
  {
    usuarioNome: "João Pereira",
    skillNome: "Swift",
    nivel: "pleno" as const,
    anos: 2,
  },
  // Beatriz (Backend)
  {
    usuarioNome: "Beatriz Lima",
    skillNome: "Node.js",
    nivel: "pleno" as const,
    anos: 3,
  },
  {
    usuarioNome: "Beatriz Lima",
    skillNome: "Python",
    nivel: "pleno" as const,
    anos: 2,
  },
  {
    usuarioNome: "Beatriz Lima",
    skillNome: "MySQL",
    nivel: "pleno" as const,
    anos: 3,
  },
  {
    usuarioNome: "Beatriz Lima",
    skillNome: "Docker",
    nivel: "junior" as const,
    anos: 1,
  },
  // Rafael (Frontend)
  {
    usuarioNome: "Rafael Costa",
    skillNome: "React",
    nivel: "pleno" as const,
    anos: 3,
  },
  {
    usuarioNome: "Rafael Costa",
    skillNome: "TypeScript",
    nivel: "pleno" as const,
    anos: 3,
  },
  {
    usuarioNome: "Rafael Costa",
    skillNome: "Vue.js",
    nivel: "junior" as const,
    anos: 1,
  },
  // Fernanda (Backend)
  {
    usuarioNome: "Fernanda Alves",
    skillNome: "PostgreSQL",
    nivel: "senior" as const,
    anos: 5,
  },
  {
    usuarioNome: "Fernanda Alves",
    skillNome: "MongoDB",
    nivel: "pleno" as const,
    anos: 3,
  },
  {
    usuarioNome: "Fernanda Alves",
    skillNome: "Python",
    nivel: "pleno" as const,
    anos: 3,
  },
  // Lucas (Mobile)
  {
    usuarioNome: "Lucas Martins",
    skillNome: "Flutter",
    nivel: "pleno" as const,
    anos: 3,
  },
  {
    usuarioNome: "Lucas Martins",
    skillNome: "Kotlin",
    nivel: "pleno" as const,
    anos: 2,
  },
  {
    usuarioNome: "Lucas Martins",
    skillNome: "React Native",
    nivel: "junior" as const,
    anos: 1,
  },
  // Camila (DevOps)
  {
    usuarioNome: "Camila Rocha",
    skillNome: "AWS",
    nivel: "pleno" as const,
    anos: 3,
  },
  {
    usuarioNome: "Camila Rocha",
    skillNome: "Terraform",
    nivel: "pleno" as const,
    anos: 2,
  },
  {
    usuarioNome: "Camila Rocha",
    skillNome: "Docker",
    nivel: "pleno" as const,
    anos: 3,
  },
  {
    usuarioNome: "Camila Rocha",
    skillNome: "Kubernetes",
    nivel: "junior" as const,
    anos: 1,
  },
  // Thiago (Frontend)
  {
    usuarioNome: "Thiago Souza",
    skillNome: "React",
    nivel: "pleno" as const,
    anos: 3,
  },
  {
    usuarioNome: "Thiago Souza",
    skillNome: "Node.js",
    nivel: "pleno" as const,
    anos: 2,
  },
  {
    usuarioNome: "Thiago Souza",
    skillNome: "TypeScript",
    nivel: "pleno" as const,
    anos: 3,
  },
  {
    usuarioNome: "Thiago Souza",
    skillNome: "CSS",
    nivel: "pleno" as const,
    anos: 3,
  },
];

const projetosData = [
  {
    nome: "API Gateway",
    descricao: "Gateway de APIs para microsserviços",
    equipeNome: "Backend",
  },
  {
    nome: "Dashboard Frontend",
    descricao: "Dashboard administrativo em React",
    equipeNome: "Frontend",
  },
  {
    nome: "Infraestrutura Cloud",
    descricao: "Provisionamento de infraestrutura AWS",
    equipeNome: "DevOps",
  },
  {
    nome: "App Mobile",
    descricao: "Aplicativo móvel multiplataforma",
    equipeNome: "Mobile",
  },
  {
    nome: "Sistema de Pagamentos",
    descricao: "Microserviço de pagamentos",
    equipeNome: "Backend",
  },
  {
    nome: "Landing Page",
    descricao: "Site institucional em Next.js",
    equipeNome: "Frontend",
  },
];

const skillsProjetoData = [
  // API Gateway
  { projetoNome: "API Gateway", skillNome: "Node.js" },
  { projetoNome: "API Gateway", skillNome: "Docker" },
  { projetoNome: "API Gateway", skillNome: "PostgreSQL" },
  // Dashboard Frontend
  { projetoNome: "Dashboard Frontend", skillNome: "React" },
  { projetoNome: "Dashboard Frontend", skillNome: "TypeScript" },
  { projetoNome: "Dashboard Frontend", skillNome: "CSS" },
  // Infraestrutura Cloud
  { projetoNome: "Infraestrutura Cloud", skillNome: "AWS" },
  { projetoNome: "Infraestrutura Cloud", skillNome: "Terraform" },
  { projetoNome: "Infraestrutura Cloud", skillNome: "Kubernetes" },
  // App Mobile
  { projetoNome: "App Mobile", skillNome: "React Native" },
  { projetoNome: "App Mobile", skillNome: "TypeScript" },
  // Sistema de Pagamentos
  { projetoNome: "Sistema de Pagamentos", skillNome: "Python" },
  { projetoNome: "Sistema de Pagamentos", skillNome: "Docker" },
  { projetoNome: "Sistema de Pagamentos", skillNome: "MySQL" },
  // Landing Page
  { projetoNome: "Landing Page", skillNome: "React" },
  { projetoNome: "Landing Page", skillNome: "CSS" },
];

async function seed() {
  console.log("Iniciando seed do banco de dados...");

  try {
    // =====================
    // EQUIPES
    // =====================
    const equipesInsert = await db
      .insert(equipes)
      .values(equipesData)
      .returning();

    const equipeMap: Record<string, number> = Object.fromEntries(
      equipesInsert.map((e) => [e.nome, e.id]),
    );

    // =====================
    // CATEGORIAS
    // =====================
    const categoriasInsert = await db
      .insert(categoriasSkills)
      .values(categoriasData)
      .returning();

    const categoriaMap: Record<string, number> = Object.fromEntries(
      categoriasInsert.map((c) => [c.nome, c.id]),
    );

    // =====================
    // SKILLS
    // =====================
    const categoriaPorId: Record<number, string> = {
      1: "Frontend",
      2: "Backend",
      3: "DevOps",
      4: "Mobile",
      5: "Database",
      6: "Cloud",
    };

    const skillsWithCorrectCategoria = skillsData.map((s) => {
      const categoriaNome = categoriaPorId[s.categoriaId];

      if (!categoriaNome) {
        throw new Error(`Categoria inválida: ${s.categoriaId}`);
      }

      const categoriaId = categoriaMap[categoriaNome];

      if (categoriaId === undefined) {
        throw new Error(`Categoria não encontrada: ${categoriaNome}`);
      }

      return {
        nome: s.nome,
        categoriaId,
      };
    });

    const skillsInsert = await db
      .insert(skills)
      .values(skillsWithCorrectCategoria)
      .returning();

    const skillMap: Record<string, number> = Object.fromEntries(
      skillsInsert.map((s) => [s.nome, s.id]),
    );

    // =====================
    // USUÁRIOS
    // =====================
    const usuariosWithEquipe = await Promise.all(
      usuariosData.map(async (u) => {
        const senhaHash = await bcrypt.hash(u.senha, 10);

        const equipeId = equipeMap[u.equipeNome];

        if (equipeId === undefined) {
          throw new Error(`Equipe não encontrada: ${u.equipeNome}`);
        }

        return {
          nome: u.nome,
          email: u.email,
          senhaHash,
          bio: u.bio,
          funcao: u.funcao,
          equipeId,
        };
      }),
    );

    const usuariosInsert = await db
      .insert(usuarios)
      .values(usuariosWithEquipe)
      .returning();

    const usuarioMap: Record<string, number> = Object.fromEntries(
      usuariosInsert.map((u) => [u.nome, u.id]),
    );

    // =====================
    // USER SKILLS
    // =====================
    const skillsUsuariosWithIds = skillsUsuariosData.map((su) => {
      const usuarioId = usuarioMap[su.usuarioNome];
      const skillId = skillMap[su.skillNome];

      if (usuarioId === undefined) {
        throw new Error(`Usuário não encontrado: ${su.usuarioNome}`);
      }

      if (skillId === undefined) {
        throw new Error(`Skill não encontrada: ${su.skillNome}`);
      }

      return {
        usuarioId,
        skillId,
        nivel: su.nivel,
        anosExperiencia: su.anos,
      };
    });

    await db.insert(skillsUsuarios).values(skillsUsuariosWithIds);

    // =====================
    // PROJETOS
    // =====================
    const projetosWithEquipe = projetosData.map((p) => {
      const equipeId = equipeMap[p.equipeNome];

      if (equipeId === undefined) {
        throw new Error(`Equipe não encontrada: ${p.equipeNome}`);
      }

      return {
        nome: p.nome,
        descricao: p.descricao,
        equipeId,
      };
    });

    const projetosInsert = await db
      .insert(projetos)
      .values(projetosWithEquipe)
      .returning();

    const projetoMap: Record<string, number> = Object.fromEntries(
      projetosInsert.map((p) => [p.nome, p.id]),
    );

    // =====================
    // PROJETO SKILLS
    // =====================
    const skillsProjetoWithIds = skillsProjetoData.map((sp) => {
      const projetoId = projetoMap[sp.projetoNome];
      const skillId = skillMap[sp.skillNome];

      if (projetoId === undefined) {
        throw new Error(`Projeto não encontrado: ${sp.projetoNome}`);
      }

      if (skillId === undefined) {
        throw new Error(`Skill não encontrada: ${sp.skillNome}`);
      }

      return {
        projetoId,
        skillId,
      };
    });

    await db.insert(skillsProjeto).values(skillsProjetoWithIds);

    // =====================
    // FINAL
    // =====================
    console.log("Seed concluído com sucesso!");
    console.log({
      equipes: equipesInsert.length,
      categorias: categoriasInsert.length,
      skills: skillsInsert.length,
      usuarios: usuariosInsert.length,
      projetos: projetosInsert.length,
    });
  } catch (error) {
    console.error("Erro no seed:", error);
    process.exit(1);
  }
}

seed();