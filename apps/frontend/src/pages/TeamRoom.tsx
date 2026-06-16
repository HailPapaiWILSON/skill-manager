import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./TeamRoom.css";

interface Skill {
  nome: string;
  nivel: number;
}

interface Membro {
  id: number;
  nome: string;
  cargo: string;
  especialidade: string;
  skills: Skill[];
}

const teamMock = {
  membros: [
    {
      id: 1,
      nome: "João Silva",
      cargo: "Frontend Engineer",
      especialidade: "Desenvolvimento Frontend",

      skills: [
        { nome: "React", nivel: 90 },
        { nome: "TypeScript", nivel: 85 },
        { nome: "CSS", nivel: 80 },
      ],
    },

    {
      id: 2,
      nome: "Maria Souza",
      cargo: "Backend Engineer",
      especialidade: "APIs e Banco de Dados",

      skills: [
        { nome: "Node.js", nivel: 95 },
        { nome: "SQLite", nivel: 80 },
        { nome: "API REST", nivel: 90 },
      ],
    },

    {
      id: 3,
      nome: "Carlos Lima",
      cargo: "DevOps Engineer",
      especialidade: "Infraestrutura",

      skills: [
        { nome: "Docker", nivel: 85 },
        { nome: "Linux", nivel: 90 },
      ],
    },
  ] as Membro[],
};

export default function TeamRoom() {
  const { teamId } = useParams();

  const navigate = useNavigate();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [meuPerfil, setMeuPerfil] = useState<Membro | null>(null);

  const [form, setForm] = useState({
    nome: "",
    cargo: "",
    especialidade: "",
    skills: "",
    nivel: 70,
  });

  function salvarPerfil() {
    if (!form.nome || !form.cargo || !form.especialidade || !form.skills) {
      alert("Preencha todos os campos");

      return;
    }

    const novoPerfil: Membro = {
      id: 99,

      nome: form.nome,

      cargo: form.cargo,

      especialidade: form.especialidade,

      skills: form.skills.split(",").map((skill) => ({
        nome: skill.trim(),

        nivel: form.nivel,
      })),
    };

    setMeuPerfil(novoPerfil);

    setMostrarFormulario(false);

    alert("Perfil criado!");
  }

  function editarPerfil() {
    if (!meuPerfil) return;

    setForm({
      nome: meuPerfil.nome,

      cargo: meuPerfil.cargo,

      especialidade: meuPerfil.especialidade,

      skills: meuPerfil.skills.map((skill) => skill.nome).join(","),

      nivel: meuPerfil.skills[0].nivel,
    });

    setMostrarFormulario(true);
  }

  function sair() {
    if (window.confirm("Deseja sair da equipe?")) {
      navigate("/");
    }
  }

  const membros = [...teamMock.membros, ...(meuPerfil ? [meuPerfil] : [])];

  return (
    <div className="skill-manager">
      <header className="skill-header">
        <div>
          <h1>Skill Manager</h1>

          <p>Mapa técnico da equipe</p>
        </div>

        <div className="team-badge">
          Equipe:
          <strong>{teamId}</strong>
        </div>
      </header>

      <section className="section">
        <h2>Especialistas</h2>

        <div className="members">
          {membros.map((member) => (
            <div className="member-card" key={member.id}>
              <h3>{member.nome}</h3>

              <p>{member.cargo}</p>

              <p>
                <strong>Especialidade:</strong>

                <br />

                {member.especialidade}
              </p>

              {member.skills.map((skill) => (
                <div className="skill-item" key={skill.nome}>
                  <div className="skill-title">
                    <span>{skill.nome}</span>

                    <small>{skill.nivel}%</small>
                  </div>

                  <div className="progress">
                    <div
                      style={{
                        width: `${skill.nivel}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="actions">
        <h2>Meu perfil</h2>

        {!meuPerfil && (
          <button onClick={() => setMostrarFormulario(true)}>
            Criar perfil
          </button>
        )}

        {meuPerfil && <button onClick={editarPerfil}>Editar perfil</button>}

        {mostrarFormulario && (
          <div className="profile-form">
            <h3>Criar perfil técnico</h3>

            <input
              placeholder="Nome"
              value={form.nome}
              onChange={(e) =>
                setForm({
                  ...form,

                  nome: e.target.value,
                })
              }
            />

            <input
              placeholder="Cargo"
              value={form.cargo}
              onChange={(e) =>
                setForm({
                  ...form,

                  cargo: e.target.value,
                })
              }
            />

            <input
              placeholder="Especialidade"
              value={form.especialidade}
              onChange={(e) =>
                setForm({
                  ...form,

                  especialidade: e.target.value,
                })
              }
            />

            <input
              placeholder="Skills (React, Node, Docker)"
              value={form.skills}
              onChange={(e) =>
                setForm({
                  ...form,

                  skills: e.target.value,
                })
              }
            />

            <input
              type="number"
              placeholder="Nível"
              value={form.nivel}
              onChange={(e) =>
                setForm({
                  ...form,

                  nivel: Number(e.target.value),
                })
              }
            />

            <button onClick={salvarPerfil}>Salvar</button>
          </div>
        )}

        <button className="danger" onClick={sair}>
          Sair da equipe
        </button>
      </section>
    </div>
  );
}
