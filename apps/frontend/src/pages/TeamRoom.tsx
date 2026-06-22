import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import "./TeamRoom.css";

interface Skill {
  nome: string;
  nivel: "junior" | "pleno" | "senior";
  anosExperiencia: number;
}

interface Membro {
  id: number;
  nome: string;
  cargo: string;
  skills: Skill[];
}

interface FormState {
  nome: string;
  cargo: string;
  skillsSelecionadas: string[];
  nivel: "junior" | "pleno" | "senior";
  anosExperiencia: number;
}

const SKILLS_DISPONIVEIS = [
  "React",
  "TypeScript",
  "Node.js",
  "Docker",
  "Linux",
  "SQL",
  "APIs",
];

const teamMock: { membros: Membro[] } = {
  membros: [
    {
      id: 1,
      nome: "João Silva",
      cargo: "Frontend Engineer",
      skills: [
        { nome: "React", nivel: "senior", anosExperiencia: 5 },
        { nome: "TypeScript", nivel: "pleno", anosExperiencia: 3 },
      ],
    },
    {
      id: 2,
      nome: "Maria Souza",
      cargo: "Backend Engineer",
      skills: [
        { nome: "Node.js", nivel: "senior", anosExperiencia: 6 },
        { nome: "SQL", nivel: "pleno", anosExperiencia: 3 },
      ],
    },
  ],
};

const initialForm: FormState = {
  nome: "",
  cargo: "",
  skillsSelecionadas: [],
  nivel: "pleno",
  anosExperiencia: 1,
};

export default function TeamRoom() {
  const { teamId } = useParams();
  const navigate = useNavigate();

  const [me, setMe] = useState<Membro | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);

  const members = useMemo(
    () => [...teamMock.membros, ...(me ? [me] : [])],
    [me]
  );

  function handleChange(field: keyof FormState, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleSkill(skill: string) {
    setForm((prev) => {
      const exists = prev.skillsSelecionadas.includes(skill);

      return {
        ...prev,
        skillsSelecionadas: exists
          ? prev.skillsSelecionadas.filter((s) => s !== skill)
          : [...prev.skillsSelecionadas, skill],
      };
    });
  }

  function saveProfile() {
    if (!form.nome || !form.cargo || form.skillsSelecionadas.length === 0)
      return;

    const newMember: Membro = {
      id: Date.now(),
      nome: form.nome,
      cargo: form.cargo,
      skills: form.skillsSelecionadas.map((skill) => ({
        nome: skill,
        nivel: form.nivel,
        anosExperiencia: form.anosExperiencia,
      })),
    };

    setMe(newMember);
    setShowForm(false);
    setForm(initialForm);
  }

  return (
    <div className="skill-manager">
      <header className="skill-header">
        <div>
          <h1>Skill Manager</h1>
          <p>Team Intelligence Dashboard</p>
        </div>

        <div className="team-badge">
          Team <strong>{teamId}</strong>
        </div>
      </header>

      <div className="layout">
        <section className="panel large">
          <h2>Equipe</h2>

          <div className="members">
            {members.map((m) => (
              <div className="member-card" key={m.id}>
                <h3>{m.nome}</h3>
                <span>{m.cargo}</span>

                <div className="skills">
                  {m.skills.map((s) => (
                    <div className="skill-chip" key={s.nome}>
                      <span>{s.nome}</span>
                      <small>{s.nivel}</small>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel small">
          <h2>Perfil</h2>

          {!me && (
            <button onClick={() => setShowForm(true)}>Criar perfil</button>
          )}

          {showForm && (
            <div className="form">
              <input
                placeholder="Nome"
                value={form.nome}
                onChange={(e) => handleChange("nome", e.target.value)}
              />

              <input
                placeholder="Cargo"
                value={form.cargo}
                onChange={(e) => handleChange("cargo", e.target.value)}
              />

              {/* SKILLS MULTI SELECT */}
              <div className="field-group">
                <label>Especialidades</label>

                <select
                  value=""
                  onChange={(e) => toggleSkill(e.target.value)}
                >
                  <option value="">Selecionar skill</option>
                  {SKILLS_DISPONIVEIS.map((skill) => (
                    <option key={skill} value={skill}>
                      {form.skillsSelecionadas.includes(skill)
                        ? `✓ ${skill}`
                        : skill}
                    </option>
                  ))}
                </select>

                <div className="skills">
                  {form.skillsSelecionadas.map((s) => (
                    <div className="skill-chip" key={s}>
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              <select
                value={form.nivel}
                onChange={(e) =>
                  handleChange("nivel", e.target.value)
                }
              >
                <option value="junior">Júnior</option>
                <option value="pleno">Pleno</option>
                <option value="senior">Sênior</option>
              </select>

              <div className="field-group">
                <label>Experiência</label>

                <select
                  value={form.anosExperiencia}
                  onChange={(e) =>
                    handleChange("anosExperiencia", Number(e.target.value))
                  }
                >
                  <option value={0}>Sem experiência</option>
                  <option value={1}>1 ano</option>
                  <option value={2}>2 anos</option>
                  <option value={3}>3 anos</option>
                  <option value={4}>4 anos</option>
                  <option value={5}>5+ anos</option>
                </select>
              </div>

              <button onClick={saveProfile}>Salvar</button>
            </div>
          )}

          <button className="danger" onClick={() => navigate("/")}>
            Sair
          </button>
        </section>
      </div>
    </div>
  );
}
