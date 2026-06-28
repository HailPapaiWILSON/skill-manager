import { db } from "../db/index.js";
import {
  usuarios,
  equipes,
  skills,
  skillsUsuarios,
  skillsProjeto,
  projetos,
  categoriasSkills,
} from "../db/schema.js";

import { eq, sql, and, inArray, notInArray, count, like, desc, asc, gt, lt } from "drizzle-orm";

function validarEquipeId(equipeId: number): boolean {
  return Number.isInteger(equipeId) && equipeId > 0;
}

function validarSkillId(skillId?: number): boolean {
  return skillId ? (Number.isInteger(skillId) && skillId > 0) : true;
}

function validarSkillName(skillName?: string): boolean {
  return skillName ? skillName.trim().length > 0 : true;
}

export async function obterTermometro(equipeId: number) {
  if (!validarEquipeId(equipeId)) {
    throw new Error("id da equipe inválido");
  }

  const equipe = await db.query.equipes.findFirst({
    where: eq(equipes.id, equipeId),
  });

  if (!equipe) {
    throw new Error("equipe não encontrada");
  }

  const projetosAtivos = await db
    .select({
      id: projetos.id,
    })
    .from(projetos)
    .where(
      and(
        eq(projetos.equipeId, equipeId),
        eq(projetos.status, "em_andamento")
      )
    );

  if (projetosAtivos.length === 0) {
    return {
      cobertura: null,
      status: null,
      totalSkillsNecessarias: 0,
      totalSkillsCobertas: 0,
      projetosAtivos: 0,
      mensagem: "Equipe não possui projetos ativos",
    };
  }

  const projetosIds = projetosAtivos.map((p) => p.id);

  const skillsNecessariasResult = await db
    .selectDistinct({
      skillId: skillsProjeto.skillId,
    })
    .from(skillsProjeto)
    .where(inArray(skillsProjeto.projetoId, projetosIds));

  const skillsNecessariasIds = skillsNecessariasResult.map((s) => s.skillId);
  const totalSkillsNecessarias = skillsNecessariasIds.length;

  if (totalSkillsNecessarias === 0) {
    return {
      cobertura: 0,
      status: "vermelho",
      totalSkillsNecessarias: 0,
      totalSkillsCobertas: 0,
      projetosAtivos: projetosAtivos.length,
    };
  }

  const skillsCobertasResult = await db
    .selectDistinct({
      skillId: skillsUsuarios.skillId,
    })
    .from(skillsUsuarios)
    .innerJoin(usuarios, eq(usuarios.id, skillsUsuarios.usuarioId))
    .where(
      and(
        eq(usuarios.equipeId, equipeId),
        inArray(skillsUsuarios.skillId, skillsNecessariasIds)
      )
    );

  const skillsCobertasIds = skillsCobertasResult.map(s => s.skillId);
  const totalSkillsCobertas = skillsCobertasIds.length;

  // 4. Calcular cobertura
  const cobertura = (totalSkillsCobertas / totalSkillsNecessarias) * 100;

  let status: string;
  if (cobertura >= 80) {
    status = "verde";
  } else if (cobertura >= 50) {
    status = "amarelo";
  } else {
    status = "vermelho";
  }

  return {
    cobertura: Math.round(cobertura * 10) / 10,
    status,
    totalSkillsNecessarias,
    totalSkillsCobertas,
    projetosAtivos: projetosAtivos.length,
  };
}


export async function obterSkillsFaltantes(equipeId: number) {
  // Validação do equipeId
  if (!validarEquipeId(equipeId)) {
    throw new Error("ID da equipe inválido. Deve ser um número inteiro positivo.");
  }

  // Verificar se a equipe existe
  const equipe = await db.query.equipes.findFirst({
    where: eq(equipes.id, equipeId),
  });

  if (!equipe) {
    throw new Error("Equipe não encontrada");
  }

  // 1. Buscar projetos ativos da equipe
  const projetosAtivos = await db
    .select({
      id: projetos.id,
    })
    .from(projetos)
    .where(
      and(
        eq(projetos.equipeId, equipeId),
        eq(projetos.status, "em_andamento")
      )
    );

  if (projetosAtivos.length === 0) {
    return {
      total: 0,
      skills: [],
      mensagem: "Equipe não possui projetos ativos"
    };
  }

  const projetosIds = projetosAtivos.map(p => p.id);

  // 2. Buscar skills necessárias (dos projetos ativos)
  const skillsNecessarias = await db
    .selectDistinct({
      skillId: skillsProjeto.skillId,
      nome: skills.nome,
      categoriaId: skills.categoriaId,
      categoriaNome: categoriasSkills.nome,
    })
    .from(skillsProjeto)
    .innerJoin(skills, eq(skills.id, skillsProjeto.skillId))
    .leftJoin(categoriasSkills, eq(categoriasSkills.id, skills.categoriaId))
    .where(inArray(skillsProjeto.projetoId, projetosIds));

  const skillsNecessariasIds = skillsNecessarias.map(s => s.skillId);

  if (skillsNecessariasIds.length === 0) {
    return {
      total: 0,
      skills: [],
    };
  }

  // 3. Buscar skills que a equipe possui
  const skillsDaEquipe = await db
    .selectDistinct({
      skillId: skillsUsuarios.skillId,
    })
    .from(skillsUsuarios)
    .innerJoin(usuarios, eq(usuarios.id, skillsUsuarios.usuarioId))
    .where(eq(usuarios.equipeId, equipeId));

  const skillsDaEquipeIds = skillsDaEquipe.map(s => s.skillId);

  // 4. Encontrar skills faltando (necessárias - possuídas)
  const skillsFaltando = skillsNecessarias.filter(
    s => !skillsDaEquipeIds.includes(s.skillId)
  );

  if (skillsFaltando.length === 0) {
    return {
      total: 0,
      skills: [],
    };
  }

  // 5. Buscar projetos que usam cada skill faltante
  const skillsFaltandoIds = skillsFaltando.map(s => s.skillId);

  const projetosPorSkill = await db
    .select({
      skillId: skillsProjeto.skillId,
      projetoId: skillsProjeto.projetoId,
      projetoNome: projetos.nome,
    })
    .from(skillsProjeto)
    .innerJoin(projetos, eq(projetos.id, skillsProjeto.projetoId))
    .where(
      and(
        inArray(skillsProjeto.skillId, skillsFaltandoIds),
        inArray(skillsProjeto.projetoId, projetosIds)
      )
    );

  // 6. Agrupar projetos por skill no JavaScript
  const projetosPorSkillMap = new Map<number, string[]>();
  projetosPorSkill.forEach(item => {
    if (!projetosPorSkillMap.has(item.skillId)) {
      projetosPorSkillMap.set(item.skillId, []);
    }
    projetosPorSkillMap.get(item.skillId)!.push(item.projetoNome);
  });

  // 7. Montar resultado final
  const skillsComProjetos = skillsFaltando.map(skill => ({
    id: skill.skillId,
    nome: skill.nome,
    categoria: skill.categoriaNome || "Sem categoria",
    projetos: projetosPorSkillMap.get(skill.skillId) || [],
  }));

  // 8. Ordenar por categoria e depois por nome
  skillsComProjetos.sort((a, b) => {
    if (a.categoria !== b.categoria) {
      return a.categoria.localeCompare(b.categoria);
    }
    return a.nome.localeCompare(b.nome);
  });

  return {
    total: skillsComProjetos.length,
    skills: skillsComProjetos,
  };
}


export async function buscarEspecialistasPorSkill(
  equipeId: number,
  skillId?: number,
  skillName?: string
) {
  // Validações
  if (!validarEquipeId(equipeId)) {
    throw new Error("ID da equipe inválido. Deve ser um número inteiro positivo.");
  }

  if (!skillId && !skillName) {
    throw new Error("É necessário fornecer skillId OU skillName");
  }

  if (skillId && !validarSkillId(skillId)) {
    throw new Error("ID da skill inválido. Deve ser um número inteiro positivo.");
  }

  if (skillName && !validarSkillName(skillName)) {
    throw new Error("Nome da skill inválido. Deve ser uma string não vazia.");
  }

  // Verificar se a equipe existe
  const equipe = await db.query.equipes.findFirst({
    where: eq(equipes.id, equipeId),
  });

  if (!equipe) {
    throw new Error("Equipe não encontrada");
  }

  // 1. Buscar a skill (por ID ou nome)
  let skillEncontrada;

  if (skillId) {
    skillEncontrada = await db.query.skills.findFirst({
      where: eq(skills.id, skillId),
    });
  } else if (skillName) {
    // Busca case-insensitive com LIKE
    skillEncontrada = await db.query.skills.findFirst({
      where: like(sql`LOWER(${skills.nome})`, `%${skillName.toLowerCase().trim()}%`),
    });
  }

  if (!skillEncontrada) {
    throw new Error("Skill não encontrada");
  }

  // 2. Buscar especialistas da equipe que têm esta skill
  const especialistas = await db
    .select({
      id: usuarios.id,
      nome: usuarios.nome,
      email: usuarios.email,
      nivel: skillsUsuarios.nivel,
      anosExperiencia: skillsUsuarios.anosExperiencia,
    })
    .from(skillsUsuarios)
    .innerJoin(usuarios, eq(usuarios.id, skillsUsuarios.usuarioId))
    .where(
      and(
        eq(skillsUsuarios.skillId, skillEncontrada.id),
        eq(usuarios.equipeId, equipeId)
      )
    )
    .orderBy(
      // Ordenar por nível (senior > pleno > junior) usando CASE
      sql`CASE ${skillsUsuarios.nivel}
        WHEN 'senior' THEN 1
        WHEN 'pleno' THEN 2
        WHEN 'junior' THEN 3
      END`,
      desc(skillsUsuarios.anosExperiencia)
    );

  return {
    skill: {
      id: skillEncontrada.id,
      nome: skillEncontrada.nome,
    },
    total: especialistas.length,
    especialistas,
  };
}


export async function obterProjetosEmRisco(equipeId: number) {
  // Validação do equipeId
  if (!validarEquipeId(equipeId)) {
    throw new Error("ID da equipe inválido. Deve ser um número inteiro positivo.");
  }

  // Verificar se a equipe existe
  const equipe = await db.query.equipes.findFirst({
    where: eq(equipes.id, equipeId),
  });

  if (!equipe) {
    throw new Error("Equipe não encontrada");
  }

  // 1. Buscar todos os projetos ativos da equipe
  const projetosAtivos = await db.query.projetos.findMany({
    where: and(
      eq(projetos.equipeId, equipeId),
      eq(projetos.status, "em_andamento")
    ),
  });

  if (projetosAtivos.length === 0) {
    return {
      total: 0,
      projetos: [],
      mensagem: "Nenhum projeto ativo encontrado"
    };
  }

  // 2. Buscar skills que a equipe possui
  const skillsDaEquipe = await db
    .selectDistinct({
      skillId: skillsUsuarios.skillId,
    })
    .from(skillsUsuarios)
    .innerJoin(usuarios, eq(usuarios.id, skillsUsuarios.usuarioId))
    .where(eq(usuarios.equipeId, equipeId));

  const skillsDaEquipeIds = new Set(skillsDaEquipe.map(s => s.skillId));

  // 3. Buscar skills de todos os projetos ativos
  const projetosIds = projetosAtivos.map(p => p.id);

  const skillsPorProjeto = await db
    .select({
      projetoId: skillsProjeto.projetoId,
      skillId: skillsProjeto.skillId,
      skillNome: skills.nome,
      skillCategoria: categoriasSkills.nome,
    })
    .from(skillsProjeto)
    .innerJoin(skills, eq(skills.id, skillsProjeto.skillId))
    .leftJoin(categoriasSkills, eq(categoriasSkills.id, skills.categoriaId))
    .where(inArray(skillsProjeto.projetoId, projetosIds));

  // 4. Agrupar skills por projeto e identificar faltantes
  const projetosEmRisco = [];
  const projetosPorId = new Map(projetosAtivos.map(p => [p.id, p]));

  // Agrupar skills por projeto
  const skillsPorProjetoMap = new Map<number, typeof skillsPorProjeto>();
  skillsPorProjeto.forEach(item => {
    if (!skillsPorProjetoMap.has(item.projetoId)) {
      skillsPorProjetoMap.set(item.projetoId, []);
    }
    skillsPorProjetoMap.get(item.projetoId)!.push(item);
  });

  // Analisar cada projeto
  for (const [projetoId, skillsDoProjeto] of skillsPorProjetoMap) {
    const skillsFaltando = skillsDoProjeto.filter(
      s => !skillsDaEquipeIds.has(s.skillId)
    );

    if (skillsFaltando.length > 0) {
      const projeto = projetosPorId.get(projetoId)!;

      // Pegar até 3 skills críticas (as mais importantes primeiro)
      const skillsCriticas = skillsFaltando
        .slice(0, 3)
        .map(s => s.skillNome);

      projetosEmRisco.push({
        id: projeto.id,
        nome: projeto.nome,
        skillsFaltando: skillsFaltando.length,
        skillsCriticas,
        skillsFaltandoTotal: skillsFaltando.length,
      });
    }
  }

  // 5. Ordenar por número de skills faltando (desc) e depois por nome
  projetosEmRisco.sort((a, b) => {
    if (a.skillsFaltando !== b.skillsFaltando) {
      return b.skillsFaltando - a.skillsFaltando;
    }
    return a.nome.localeCompare(b.nome);
  });

  return {
    total: projetosEmRisco.length,
    projetos: projetosEmRisco,
  };
}


export async function obterSkillsMaisUsadas(equipeId: number) {
  // Validação do equipeId
  if (!validarEquipeId(equipeId)) {
    throw new Error("ID da equipe inválido. Deve ser um número inteiro positivo.");
  }

  // Verificar se a equipe existe
  const equipe = await db.query.equipes.findFirst({
    where: eq(equipes.id, equipeId),
  });

  if (!equipe) {
    throw new Error("Equipe não encontrada");
  }

  // 1. Buscar total de projetos ativos da equipe
  const totalProjetosResult = await db
    .select({
      total: count(projetos.id),
    })
    .from(projetos)
    .where(
      and(
        eq(projetos.equipeId, equipeId),
        eq(projetos.status, "em_andamento")
      )
    );

  const totalProjetos = totalProjetosResult[0]?.total || 0;

  if (totalProjetos === 0) {
    return {
      totalSkills: 0,
      topSkills: [],
      mensagem: "Equipe não possui projetos ativos"
    };
  }

  // 2. Buscar skills com contagem de projetos
  const skillsRanking = await db
    .select({
      skillId: skills.id,
      skillNome: skills.nome,
      categoriaNome: categoriasSkills.nome,
      totalProjetos: count(skillsProjeto.projetoId),
    })
    .from(skillsProjeto)
    .innerJoin(skills, eq(skills.id, skillsProjeto.skillId))
    .leftJoin(categoriasSkills, eq(categoriasSkills.id, skills.categoriaId))
    .innerJoin(projetos, eq(projetos.id, skillsProjeto.projetoId))
    .where(
      and(
        eq(projetos.equipeId, equipeId),
        eq(projetos.status, "em_andamento")
      )
    )
    .groupBy(skills.id, skills.nome, categoriasSkills.nome)
    .orderBy(desc(count(skillsProjeto.projetoId)))
    .limit(5);

  // 3. Calcular percentuais e montar resultado
  const topSkills = skillsRanking.map(skill => ({
    skill: skill.skillNome,
    categoria: skill.categoriaNome || "Sem categoria",
    totalProjetos: skill.totalProjetos,
    percentual: Math.round((skill.totalProjetos / totalProjetos) * 100),
  }));

  return {
    totalSkills: skillsRanking.length,
    topSkills,
  };
}


export async function obterRankingPolivalencia(equipeId: number) {
  // Validação do equipeId
  if (!validarEquipeId(equipeId)) {
    throw new Error("ID da equipe inválido. Deve ser um número inteiro positivo.");
  }

  // Verificar se a equipe existe
  const equipe = await db.query.equipes.findFirst({
    where: eq(equipes.id, equipeId),
  });

  if (!equipe) {
    throw new Error("Equipe não encontrada");
  }

  // 1. Buscar total de membros da equipe
  const totalMembrosResult = await db
    .select({
      total: count(usuarios.id),
    })
    .from(usuarios)
    .where(eq(usuarios.equipeId, equipeId));

  const totalMembros = totalMembrosResult[0]?.total || 0;

  if (totalMembros === 0) {
    return {
      totalMembros: 0,
      ranking: [],
      mensagem: "Equipe não possui membros"
    };
  }

  // 2. Buscar ranking de polivalência
  const ranking = await db
    .select({
      id: usuarios.id,
      nome: usuarios.nome,
      email: usuarios.email,
      totalSkills: count(skillsUsuarios.skillId),
      // Detalhamento por nível usando CASE
      totalSenior: sql<number>`COUNT(CASE WHEN ${skillsUsuarios.nivel} = 'senior' THEN 1 END)`.as("totalSenior"),
      totalPleno: sql<number>`COUNT(CASE WHEN ${skillsUsuarios.nivel} = 'pleno' THEN 1 END)`.as("totalPleno"),
      totalJunior: sql<number>`COUNT(CASE WHEN ${skillsUsuarios.nivel} = 'junior' THEN 1 END)`.as("totalJunior"),
    })
    .from(usuarios)
    .leftJoin(skillsUsuarios, eq(skillsUsuarios.usuarioId, usuarios.id))
    .where(eq(usuarios.equipeId, equipeId))
    .groupBy(usuarios.id, usuarios.nome, usuarios.email)
    .orderBy(desc(count(skillsUsuarios.skillId)))
    .limit(10);

  // 3. Montar resultado final
  const rankingFormatado = ranking.map(usuario => ({
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    totalSkills: usuario.totalSkills,
    detalhamento: {
      senior: usuario.totalSenior || 0,
      pleno: usuario.totalPleno || 0,
      junior: usuario.totalJunior || 0,
    },
  }));

  return {
    totalMembros,
    ranking: rankingFormatado,
  };
}
