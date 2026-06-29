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
  { nome: "Data Science", codigoIngresso: "DAT098" },
  { nome: "QA", codigoIngresso: "QA098" },
  { nome: "Security", codigoIngresso: "SEC098" },
  { nome: "Product", codigoIngresso: "PRO098" },
  { nome: "UX/UI", codigoIngresso: "UX098" },
];

const categoriasData = [
  { nome: "Frontend" },
  { nome: "Backend" },
  { nome: "DevOps" },
  { nome: "Mobile" },
  { nome: "Database" },
  { nome: "Cloud" },
  { nome: "Data Science" },
  { nome: "Security" },
  { nome: "Testing" },
  { nome: "Design" },
];

const skillsData = [
  // Frontend
  { nome: "React", categoriaId: 1 },
  { nome: "Vue.js", categoriaId: 1 },
  { nome: "Angular", categoriaId: 1 },
  { nome: "TypeScript", categoriaId: 1 },
  { nome: "CSS", categoriaId: 1 },
  { nome: "SASS", categoriaId: 1 },
  { nome: "Tailwind", categoriaId: 1 },
  { nome: "Next.js", categoriaId: 1 },
  // Backend
  { nome: "Node.js", categoriaId: 2 },
  { nome: "Python", categoriaId: 2 },
  { nome: "Java", categoriaId: 2 },
  { nome: "C#", categoriaId: 2 },
  { nome: "PHP", categoriaId: 2 },
  { nome: "Go", categoriaId: 2 },
  { nome: "Ruby", categoriaId: 2 },
  { nome: "NestJS", categoriaId: 2 },
  // DevOps
  { nome: "Docker", categoriaId: 3 },
  { nome: "Kubernetes", categoriaId: 3 },
  { nome: "AWS", categoriaId: 3 },
  { nome: "Terraform", categoriaId: 3 },
  { nome: "GitLab CI", categoriaId: 3 },
  { nome: "Jenkins", categoriaId: 3 },
  { nome: "Ansible", categoriaId: 3 },
  // Mobile
  { nome: "React Native", categoriaId: 4 },
  { nome: "Flutter", categoriaId: 4 },
  { nome: "Swift", categoriaId: 4 },
  { nome: "Kotlin", categoriaId: 4 },
  { nome: "iOS", categoriaId: 4 },
  { nome: "Android", categoriaId: 4 },
  // Database
  { nome: "PostgreSQL", categoriaId: 5 },
  { nome: "MongoDB", categoriaId: 5 },
  { nome: "Redis", categoriaId: 5 },
  { nome: "MySQL", categoriaId: 5 },
  { nome: "Elasticsearch", categoriaId: 5 },
  { nome: "Cassandra", categoriaId: 5 },
  // Cloud
  { nome: "Azure", categoriaId: 6 },
  { nome: "GCP", categoriaId: 6 },
  { nome: "Heroku", categoriaId: 6 },
  { nome: "DigitalOcean", categoriaId: 6 },
  { nome: "Cloudflare", categoriaId: 6 },
  // Data Science
  { nome: "Pandas", categoriaId: 7 },
  { nome: "NumPy", categoriaId: 7 },
  { nome: "Scikit-learn", categoriaId: 7 },
  { nome: "TensorFlow", categoriaId: 7 },
  { nome: "PyTorch", categoriaId: 7 },
  { nome: "R", categoriaId: 7 },
  // Security
  { nome: "OWASP", categoriaId: 8 },
  { nome: "Penetration Testing", categoriaId: 8 },
  { nome: "Encryption", categoriaId: 8 },
  { nome: "Zero Trust", categoriaId: 8 },
  { nome: "SIEM", categoriaId: 8 },
  // Testing
  { nome: "Jest", categoriaId: 9 },
  { nome: "Cypress", categoriaId: 9 },
  { nome: "Selenium", categoriaId: 9 },
  { nome: "PyTest", categoriaId: 9 },
  { nome: "JUnit", categoriaId: 9 },
  // Design
  { nome: "Figma", categoriaId: 10 },
  { nome: "Adobe XD", categoriaId: 10 },
  { nome: "Sketch", categoriaId: 10 },
  { nome: "Photoshop", categoriaId: 10 },
  { nome: "Illustrator", categoriaId: 10 },
];

const usuariosData = [
  // Administrators
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
  // Backend
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
  // New users for Data Science
  {
    nome: "Gabriela Nunes",
    email: "gabriela@empresa.com",
    senha: "senha123",
    bio: "Data Scientist com especialização em machine learning",
    funcao: "usuario" as const,
    equipeNome: "Data Science",
  },
  {
    nome: "Roberto Silva",
    email: "roberto@empresa.com",
    senha: "senha123",
    bio: "Analista de dados com experiência em Python e SQL",
    funcao: "usuario" as const,
    equipeNome: "Data Science",
  },
  // New users for QA
  {
    nome: "Patrícia Ferreira",
    email: "patricia@empresa.com",
    senha: "senha123",
    bio: "QA Engineer especialista em testes automatizados",
    funcao: "usuario" as const,
    equipeNome: "QA",
  },
  {
    nome: "Daniel Oliveira",
    email: "daniel@empresa.com",
    senha: "senha123",
    bio: "Engenheiro de qualidade com foco em performance",
    funcao: "usuario" as const,
    equipeNome: "QA",
  },
  // New users for Security
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
  // New users for Product
  {
    nome: "Aline Martins",
    email: "aline@empresa.com",
    senha: "senha123",
    bio: "Product Manager apaixonada por tecnologia e inovação",
    funcao: "usuario" as const,
    equipeNome: "Product",
  },
  {
    nome: "Felipe Andrade",
    email: "felipe@empresa.com",
    senha: "senha123",
    bio: "Product Owner com experiência em métodos ágeis",
    funcao: "usuario" as const,
    equipeNome: "Product",
  },
  // New users for UX/UI
  {
    nome: "Juliana Araújo",
    email: "juliana@empresa.com",
    senha: "senha123",
    bio: "UX Designer com foco em experiência do usuário",
    funcao: "usuario" as const,
    equipeNome: "UX/UI",
  },
  {
    nome: "Marcelo Gomes",
    email: "marcelo@empresa.com",
    senha: "senha123",
    bio: "UI Designer especialista em interfaces web",
    funcao: "usuario" as const,
    equipeNome: "UX/UI",
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
    skillNome: "PostgreSQL",
    nivel: "senior" as const,
    anos: 6,
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
  // Gabriela (Data Science)
  {
    usuarioNome: "Gabriela Nunes",
    skillNome: "Python",
    nivel: "senior" as const,
    anos: 5,
  },
  {
    usuarioNome: "Gabriela Nunes",
    skillNome: "Pandas",
    nivel: "senior" as const,
    anos: 4,
  },
  {
    usuarioNome: "Gabriela Nunes",
    skillNome: "TensorFlow",
    nivel: "pleno" as const,
    anos: 3,
  },
  {
    usuarioNome: "Gabriela Nunes",
    skillNome: "PostgreSQL",
    nivel: "pleno" as const,
    anos: 3,
  },
  // Roberto (Data Science)
  {
    usuarioNome: "Roberto Silva",
    skillNome: "Python",
    nivel: "pleno" as const,
    anos: 3,
  },
  {
    usuarioNome: "Roberto Silva",
    skillNome: "NumPy",
    nivel: "pleno" as const,
    anos: 3,
  },
  {
    usuarioNome: "Roberto Silva",
    skillNome: "Scikit-learn",
    nivel: "pleno" as const,
    anos: 2,
  },
  // Patrícia (QA)
  {
    usuarioNome: "Patrícia Ferreira",
    skillNome: "Cypress",
    nivel: "senior" as const,
    anos: 4,
  },
  {
    usuarioNome: "Patrícia Ferreira",
    skillNome: "Jest",
    nivel: "senior" as const,
    anos: 4,
  },
  {
    usuarioNome: "Patrícia Ferreira",
    skillNome: "Selenium",
    nivel: "pleno" as const,
    anos: 3,
  },
  // Daniel (QA)
  {
    usuarioNome: "Daniel Oliveira",
    skillNome: "PyTest",
    nivel: "pleno" as const,
    anos: 3,
  },
  {
    usuarioNome: "Daniel Oliveira",
    skillNome: "JUnit",
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
  // Aline (Product)
  {
    usuarioNome: "Aline Martins",
    skillNome: "TypeScript",
    nivel: "pleno" as const,
    anos: 3,
  },
  {
    usuarioNome: "Aline Martins",
    skillNome: "React",
    nivel: "pleno" as const,
    anos: 3,
  },
  // Felipe (Product)
  {
    usuarioNome: "Felipe Andrade",
    skillNome: "React",
    nivel: "junior" as const,
    anos: 2,
  },
  // Juliana (UX/UI)
  {
    usuarioNome: "Juliana Araújo",
    skillNome: "Figma",
    nivel: "senior" as const,
    anos: 5,
  },
  {
    usuarioNome: "Juliana Araújo",
    skillNome: "Adobe XD",
    nivel: "pleno" as const,
    anos: 3,
  },
  {
    usuarioNome: "Juliana Araújo",
    skillNome: "CSS",
    nivel: "pleno" as const,
    anos: 3,
  },
  // Marcelo (UX/UI)
  {
    usuarioNome: "Marcelo Gomes",
    skillNome: "Photoshop",
    nivel: "pleno" as const,
    anos: 4,
  },
  {
    usuarioNome: "Marcelo Gomes",
    skillNome: "Illustrator",
    nivel: "pleno" as const,
    anos: 3,
  },
  {
    usuarioNome: "Marcelo Gomes",
    skillNome: "Figma",
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
  // New projects
  {
    nome: "Data Pipeline",
    descricao: "Pipeline de processamento de dados em tempo real",
    equipeNome: "Data Science",
  },
  {
    nome: "ML Model API",
    descricao: "API para servir modelos de machine learning",
    equipeNome: "Data Science",
  },
  {
    nome: "Test Automation Framework",
    descricao: "Framework para testes automatizados",
    equipeNome: "QA",
  },
  {
    nome: "Security Monitoring",
    descricao: "Sistema de monitoramento de segurança",
    equipeNome: "Security",
  },
  {
    nome: "User Analytics",
    descricao: "Plataforma de análise de comportamento de usuários",
    equipeNome: "Product",
  },
  {
    nome: "Design System",
    descricao: "Sistema de design unificado para a empresa",
    equipeNome: "UX/UI",
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
  {
    nome: "Mobile Analytics SDK",
    descricao: "SDK para analytics em aplicativos mobile",
    equipeNome: "Mobile",
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
  // Data Pipeline
  { projetoNome: "Data Pipeline", skillNome: "Python" },
  { projetoNome: "Data Pipeline", skillNome: "Pandas" },
  { projetoNome: "Data Pipeline", skillNome: "PostgreSQL" },
  // ML Model API
  { projetoNome: "ML Model API", skillNome: "Python" },
  { projetoNome: "ML Model API", skillNome: "TensorFlow" },
  { projetoNome: "ML Model API", skillNome: "Docker" },
  // Test Automation Framework
  { projetoNome: "Test Automation Framework", skillNome: "Cypress" },
  { projetoNome: "Test Automation Framework", skillNome: "Jest" },
  { projetoNome: "Test Automation Framework", skillNome: "TypeScript" },
  // Security Monitoring
  { projetoNome: "Security Monitoring", skillNome: "OWASP" },
  { projetoNome: "Security Monitoring", skillNome: "SIEM" },
  { projetoNome: "Security Monitoring", skillNome: "AWS" },
  // User Analytics
  { projetoNome: "User Analytics", skillNome: "Python" },
  { projetoNome: "User Analytics", skillNome: "PostgreSQL" },
  { projetoNome: "User Analytics", skillNome: "React" },
  // Design System
  { projetoNome: "Design System", skillNome: "Figma" },
  { projetoNome: "Design System", skillNome: "React" },
  { projetoNome: "Design System", skillNome: "TypeScript" },
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
  // Mobile Analytics SDK
  { projetoNome: "Mobile Analytics SDK", skillNome: "React Native" },
  { projetoNome: "Mobile Analytics SDK", skillNome: "Kotlin" },
  { projetoNome: "Mobile Analytics SDK", skillNome: "Swift" },
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
      7: "Data Science",
      8: "Security",
      9: "Testing",
      10: "Design",
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
