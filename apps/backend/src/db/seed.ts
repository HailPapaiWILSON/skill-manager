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
  { nome: "Security", codigoIngresso: "SEC098" },
];

const categoriasData = [
  { nome: "Backend" },
  { nome: "Frontend" },
  { nome: "Database" },
  { nome: "DevOps" },
  { nome: "Cloud" },
  { nome: "Security" },
];

const skillsData = [
  // ========== Backend (categoriaId: 1) ==========
  // Languages
  { nome: "Node.js", categoriaId: 1 },
  { nome: "Python", categoriaId: 1 },
  { nome: "Java", categoriaId: 1 },
  { nome: "C#", categoriaId: 1 },
  { nome: "PHP", categoriaId: 1 },
  { nome: "Ruby", categoriaId: 1 },
  { nome: "Go", categoriaId: 1 },
  { nome: "Rust", categoriaId: 1 },
  // Frameworks
  { nome: "Spring Boot", categoriaId: 1 },
  { nome: "Django", categoriaId: 1 },
  { nome: "Flask", categoriaId: 1 },
  { nome: ".NET Core", categoriaId: 1 },
  { nome: "Laravel", categoriaId: 1 },
  { nome: "Ruby on Rails", categoriaId: 1 },

  // ========== Frontend (categoriaId: 2) ==========
  // Languages
  { nome: "JavaScript", categoriaId: 2 },
  { nome: "TypeScript", categoriaId: 2 },
  { nome: "HTML5", categoriaId: 2 },
  { nome: "CSS", categoriaId: 2 },
  // Frameworks / Libraries
  { nome: "React", categoriaId: 2 },
  { nome: "Angular", categoriaId: 2 },
  { nome: "Vue.js", categoriaId: 2 },
  { nome: "Svelte", categoriaId: 2 },
  { nome: "Next.js", categoriaId: 2 },
  { nome: "Nuxt.js", categoriaId: 2 },

  // ========== Database (categoriaId: 3) ==========
  // (These are already standalone DBMS names)
  { nome: "PostgreSQL", categoriaId: 3 },
  { nome: "MySQL", categoriaId: 3 },
  { nome: "MongoDB", categoriaId: 3 },
  { nome: "Redis", categoriaId: 3 },
  { nome: "Cassandra", categoriaId: 3 },
  { nome: "Oracle DB", categoriaId: 3 },
  { nome: "SQLite", categoriaId: 3 },
  { nome: "DynamoDB", categoriaId: 3 },

  // ========== DevOps (categoriaId: 4) ==========
  { nome: "Docker", categoriaId: 4 },
  { nome: "Kubernetes", categoriaId: 4 },
  { nome: "Jenkins", categoriaId: 4 },
  { nome: "Ansible", categoriaId: 4 },
  { nome: "Terraform", categoriaId: 4 },
  { nome: "GitLab CI/CD", categoriaId: 4 },
  { nome: "GitHub Actions", categoriaId: 4 },
  { nome: "Prometheus", categoriaId: 4 },
  { nome: "Grafana", categoriaId: 4 },

  // ========== Cloud (categoriaId: 5) ==========
  { nome: "AWS", categoriaId: 5 },
  { nome: "Microsoft Azure", categoriaId: 5 },
  { nome: "Google Cloud Platform", categoriaId: 5 },
  { nome: "IBM Cloud", categoriaId: 5 },
  { nome: "Oracle Cloud", categoriaId: 5 },
  { nome: "Alibaba Cloud", categoriaId: 5 },
  { nome: "OpenStack", categoriaId: 5 },

  // ========== Security (categoriaId: 6) ==========
  { nome: "OWASP", categoriaId: 6 },
  { nome: "Penetration Testing", categoriaId: 6 },
  { nome: "Kali Linux", categoriaId: 6 },
  { nome: "Metasploit", categoriaId: 6 },
  { nome: "Encryption (AES)", categoriaId: 6 },
  { nome: "Encryption (RSA)", categoriaId: 6 },
  { nome: "OAuth", categoriaId: 6 },
  { nome: "JWT", categoriaId: 6 },
  { nome: "SAML", categoriaId: 6 },
  { nome: "SOC2 Compliance", categoriaId: 6 },
  { nome: "ISO 27001", categoriaId: 6 },
  { nome: "Network Security", categoriaId: 6 },
  { nome: "Firewalls", categoriaId: 6 },
  { nome: "IDS/IPS", categoriaId: 6 },
  { nome: "Secure Coding", categoriaId: 6 },
  { nome: "Vulnerability Management", categoriaId: 6 },
  { nome: "Nessus", categoriaId: 6 },
  { nome: "Qualys", categoriaId: 6 },
  { nome: "SIEM", categoriaId: 6 },
  { nome: "Zero Trust", categoriaId: 6 },
];

// =====================
// USUÁRIOS (apenas times mantidos, mínimo 5 por time, exatamente 3 admins)
// =====================
const usuariosData = [
  // Administradores (3)
  {
    nome: "Ana Silva",
    email: "ana@empresa.com",
    senha: "senha123",
    bio: "Especialista em back-end com 5 anos de experiência",
    funcao: "administrador" as const,
    equipeNome: "Backend",
  },
  {
    nome: "Paulo Mendes",
    email: "paulo@empresa.com",
    senha: "senha123",
    bio: "Arquiteto de software com foco em microserviços",
    funcao: "administrador" as const,
    equipeNome: "Backend",
  },
  {
    nome: "Carlos Santos",
    email: "carlos@empresa.com",
    senha: "senha123",
    bio: "Desenvolvedor fullstack apaixonado por React",
    funcao: "administrador" as const,
    equipeNome: "Frontend",
  },
  // Backend (já temos Ana, Paulo; precisamos de +3 para chegar a 5)
  {
    nome: "Beatriz Lima",
    email: "beatriz@empresa.com",
    senha: "senha123",
    bio: "Backend developer com foco em Node.js e Python",
    funcao: "usuario" as const,
    equipeNome: "Backend",
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
    nome: "Lívia Ferreira",
    email: "livia@empresa.com",
    senha: "senha123",
    bio: "Desenvolvedora backend com experiência em Java e Go",
    funcao: "usuario" as const,
    equipeNome: "Backend",
  },
  // Frontend (Carlos já incluso; precisamos de +4)
  {
    nome: "Rafael Costa",
    email: "rafael@empresa.com",
    senha: "senha123",
    bio: "Frontend developer expert em TypeScript e React",
    funcao: "usuario" as const,
    equipeNome: "Frontend",
  },
  {
    nome: "Thiago Souza",
    email: "thiago@empresa.com",
    senha: "senha123",
    bio: "Fullstack developer com foco em Node.js e React",
    funcao: "usuario" as const,
    equipeNome: "Frontend",
  },
  {
    nome: "Marcos Vinícius",
    email: "marcos@empresa.com",
    senha: "senha123",
    bio: "Especialista em UI com React e CSS",
    funcao: "usuario" as const,
    equipeNome: "Frontend",
  },
  {
    nome: "Juliana Castro",
    email: "juliana.c@empresa.com",
    senha: "senha123",
    bio: "Desenvolvedora frontend com foco em Vue.js",
    funcao: "usuario" as const,
    equipeNome: "Frontend",
  },
  // DevOps (Mariana, Camila; +3)
  {
    nome: "Mariana Oliveira",
    email: "mariana@empresa.com",
    senha: "senha123",
    bio: "DevOps engineer com foco em AWS e Kubernetes",
    funcao: "usuario" as const,
    equipeNome: "DevOps",
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
    nome: "André Lima",
    email: "andre@empresa.com",
    senha: "senha123",
    bio: "Engenheiro DevOps com foco em CI/CD",
    funcao: "usuario" as const,
    equipeNome: "DevOps",
  },
  {
    nome: "Bruna Cardoso",
    email: "bruna@empresa.com",
    senha: "senha123",
    bio: "Especialista em infraestrutura e Docker",
    funcao: "usuario" as const,
    equipeNome: "DevOps",
  },
  {
    nome: "Diego Almeida",
    email: "diego@empresa.com",
    senha: "senha123",
    bio: "DevOps com experiência em Kubernetes e GitLab",
    funcao: "usuario" as const,
    equipeNome: "DevOps",
  },
  // Security (Isabela, Rodrigo; +3)
  {
    nome: "Isabela Costa",
    email: "isabela@empresa.com",
    senha: "senha123",
    bio: "Security specialist focada em aplicações web",
    funcao: "usuario" as const,
    equipeNome: "Security",
  },
  {
    nome: "Rodrigo Santos",
    email: "rodrigo@empresa.com",
    senha: "senha123",
    bio: "Analista de segurança com experiência em cloud",
    funcao: "usuario" as const,
    equipeNome: "Security",
  },
  {
    nome: "Carla Menezes",
    email: "carla@empresa.com",
    senha: "senha123",
    bio: "Especialista em segurança ofensiva e pentest",
    funcao: "usuario" as const,
    equipeNome: "Security",
  },
  {
    nome: "Eduardo Rocha",
    email: "eduardo@empresa.com",
    senha: "senha123",
    bio: "Engenheiro de segurança com foco em SIEM",
    funcao: "usuario" as const,
    equipeNome: "Security",
  },
  {
    nome: "Patricia Nogueira",
    email: "patricia.n@empresa.com",
    senha: "senha123",
    bio: "Analista de vulnerabilidades e compliance",
    funcao: "usuario" as const,
    equipeNome: "Security",
  },
];

// =====================
// USER-SKILLS (apenas usuários e skills mantidos)
// =====================
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
    skillNome: "MySQL",
    nivel: "senior" as const,
    anos: 5,
  },
  {
    usuarioNome: "Ana Silva",
    skillNome: "Docker",
    nivel: "pleno" as const,
    anos: 3,
  },
  // Paulo (Backend)
  {
    usuarioNome: "Paulo Mendes",
    skillNome: "Java",
    nivel: "senior" as const,
    anos: 7,
  },
  {
    usuarioNome: "Paulo Mendes",
    skillNome: "Go",
    nivel: "pleno" as const,
    anos: 3,
  },
  {
    usuarioNome: "Paulo Mendes",
    skillNome: "MySQL",
    nivel: "senior" as const,
    anos: 6,
  },
  // Carlos (Frontend, admin)
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
  // Fernanda (Backend)
  {
    usuarioNome: "Fernanda Alves",
    skillNome: "MySQL",
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
  // Lívia (Backend)
  {
    usuarioNome: "Lívia Ferreira",
    skillNome: "Java",
    nivel: "pleno" as const,
    anos: 3,
  },
  {
    usuarioNome: "Lívia Ferreira",
    skillNome: "Go",
    nivel: "pleno" as const,
    anos: 2,
  },
  {
    usuarioNome: "Lívia Ferreira",
    skillNome: "MySQL",
    nivel: "pleno" as const,
    anos: 2,
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
  // Marcos Vinícius (Frontend)
  {
    usuarioNome: "Marcos Vinícius",
    skillNome: "React",
    nivel: "pleno" as const,
    anos: 2,
  },
  {
    usuarioNome: "Marcos Vinícius",
    skillNome: "CSS",
    nivel: "pleno" as const,
    anos: 3,
  },
  // Juliana Castro (Frontend)
  {
    usuarioNome: "Juliana Castro",
    skillNome: "Vue.js",
    nivel: "pleno" as const,
    anos: 3,
  },
  {
    usuarioNome: "Juliana Castro",
    skillNome: "TypeScript",
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
  // André (DevOps)
  {
    usuarioNome: "André Lima",
    skillNome: "Docker",
    nivel: "pleno" as const,
    anos: 3,
  },
  {
    usuarioNome: "André Lima",
    skillNome: "GitLab CI/CD",
    nivel: "pleno" as const,
    anos: 2,
  },
  // Bruna (DevOps)
  {
    usuarioNome: "Bruna Cardoso",
    skillNome: "Kubernetes",
    nivel: "pleno" as const,
    anos: 2,
  },
  {
    usuarioNome: "Bruna Cardoso",
    skillNome: "AWS",
    nivel: "pleno" as const,
    anos: 3,
  },
  // Diego (DevOps)
  {
    usuarioNome: "Diego Almeida",
    skillNome: "Terraform",
    nivel: "pleno" as const,
    anos: 2,
  },
  {
    usuarioNome: "Diego Almeida",
    skillNome: "GitLab CI/CD",
    nivel: "pleno" as const,
    anos: 2,
  },
  // Isabela (Security)
  {
    usuarioNome: "Isabela Costa",
    skillNome: "OWASP",
    nivel: "senior" as const,
    anos: 5,
  },
  {
    usuarioNome: "Isabela Costa",
    skillNome: "Penetration Testing",
    nivel: "pleno" as const,
    anos: 3,
  },
  {
    usuarioNome: "Isabela Costa",
    skillNome: "AWS",
    nivel: "pleno" as const,
    anos: 3,
  },
  // Rodrigo (Security)
  {
    usuarioNome: "Rodrigo Santos",
    skillNome: "SIEM",
    nivel: "pleno" as const,
    anos: 3,
  },
  {
    usuarioNome: "Rodrigo Santos",
    skillNome: "Zero Trust",
    nivel: "pleno" as const,
    anos: 2,
  },
  // Carla (Security)
  {
    usuarioNome: "Carla Menezes",
    skillNome: "OWASP",
    nivel: "pleno" as const,
    anos: 3,
  },
  {
    usuarioNome: "Carla Menezes",
    skillNome: "Encryption (AES)",
    nivel: "pleno" as const,
    anos: 2,
  },
  // Eduardo (Security)
  {
    usuarioNome: "Eduardo Rocha",
    skillNome: "SIEM",
    nivel: "pleno" as const,
    anos: 4,
  },
  {
    usuarioNome: "Eduardo Rocha",
    skillNome: "Penetration Testing",
    nivel: "pleno" as const,
    anos: 2,
  },
  // Patricia (Security)
  {
    usuarioNome: "Patricia Nogueira",
    skillNome: "Zero Trust",
    nivel: "pleno" as const,
    anos: 2,
  },
  {
    usuarioNome: "Patricia Nogueira",
    skillNome: "Encryption (RSA)",
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
    nome: "Sistema de Pagamentos",
    descricao: "Microserviço de pagamentos",
    equipeNome: "Backend",
  },
  {
    nome: "Landing Page",
    descricao: "Site institucional em Next.js",
    equipeNome: "Frontend",
  },
  {
    nome: "Security Monitoring",
    descricao: "Sistema de monitoramento de segurança",
    equipeNome: "Security",
  },
  {
    nome: "User Authentication",
    descricao: "Serviço de autenticação e autorização",
    equipeNome: "Backend",
  },
  {
    nome: "Real-time Dashboard",
    descricao: "Dashboard com dados em tempo real",
    equipeNome: "Frontend",
  },
  {
    nome: "Container Orchestration",
    descricao: "Sistema de orquestração de containers",
    equipeNome: "DevOps",
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
  // Sistema de Pagamentos
  { projetoNome: "Sistema de Pagamentos", skillNome: "Python" },
  { projetoNome: "Sistema de Pagamentos", skillNome: "Docker" },
  { projetoNome: "Sistema de Pagamentos", skillNome: "MySQL" },
  // Landing Page
  { projetoNome: "Landing Page", skillNome: "React" },
  { projetoNome: "Landing Page", skillNome: "CSS" },
  // Security Monitoring
  { projetoNome: "Security Monitoring", skillNome: "OWASP" },
  { projetoNome: "Security Monitoring", skillNome: "SIEM" },
  { projetoNome: "Security Monitoring", skillNome: "AWS" },
  // User Authentication
  { projetoNome: "User Authentication", skillNome: "Node.js" },
  { projetoNome: "User Authentication", skillNome: "PostgreSQL" },
  { projetoNome: "User Authentication", skillNome: "Docker" },
  // Real-time Dashboard
  { projetoNome: "Real-time Dashboard", skillNome: "React" },
  { projetoNome: "Real-time Dashboard", skillNome: "TypeScript" },
  { projetoNome: "Real-time Dashboard", skillNome: "CSS" },
  // Container Orchestration
  { projetoNome: "Container Orchestration", skillNome: "Kubernetes" },
  { projetoNome: "Container Orchestration", skillNome: "Docker" },
  { projetoNome: "Container Orchestration", skillNome: "AWS" },
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
      1: "Backend",
      2: "Frontend",
      3: "Database",
      4: "DevOps",
      5: "Cloud",
      6: "Security",
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
