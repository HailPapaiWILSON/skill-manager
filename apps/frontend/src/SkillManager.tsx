import React from "react";
import "./SkillManager.css";

export default function SkillManager() {
  return (
    <div className="skill-container">
      <h1>Skill Manager</h1>
      <p className="subtitle">
        Ferramentas para análise técnica e gestão de competências organizacionais
      </p>

      {/* Gestão de Usuários */}
      <section className="card">
        <h2>Gestão de Usuários</h2>
        <ul>
          <li>
            <strong>Perfil Técnico:</strong> Cada usuário gerencia suas próprias habilidades e níveis de domínio.
          </li>
          <li>
            <strong>Busca de Especialistas:</strong> Localização rápida de profissionais com base em stacks específicas.
          </li>
        </ul>
      </section>

      {/* Organização por Equipes */}
      <section className="card">
        <h2>Organização por Equipes</h2>
        <ul>
          <li>
            <strong>Visão por Squad/Chapter:</strong> Agrupamento de usuários em times (Backend, Frontend, DevOps, etc.).
          </li>
          <li>
            <strong>Detecção de Gaps:</strong> Identificação de competências em falta nas equipes.
          </li>
        </ul>
      </section>

      {/* Analytics */}
      <section className="card">
        <h2>Analytics e Dashboards</h2>
        <ul>
          <li>
            <strong>Heatmaps:</strong> Cruzamento de times e tecnologias.
          </li>
          <li>
            <strong>Risco Técnico:</strong> Tecnologias críticas com poucos especialistas.
          </li>
          <li>
            <strong>Mentores:</strong> Sugestão de especialistas internos.
          </li>
        </ul>
      </section>

      {/* Skills */}
      <section className="card">
        <h2>Skills Padronizadas</h2>
        <ul>
          <li>
            <strong>Catálogo Global:</strong> Evita duplicidade de skills.
          </li>
          <li>
            <strong>Categorização:</strong> Frontend, Backend, Infra etc.
          </li>
        </ul>
      </section>
    </div>
  );
}
