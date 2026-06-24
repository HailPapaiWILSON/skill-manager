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
  userId: string;
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

const STORAGE_KEY = "team_profiles";

const SKILLS_DISPONIVEIS = [
  "React",
  "TypeScript",
  "Node.js",
  "Docker",
  "Linux",
  "SQL",
  "APIs",
];

export default function TeamRoom() {
  const { teamId } = useParams();
  const navigate = useNavigate();

  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser") || "null");
    } catch {
      return null;
    }
  }, []);

  const userId = currentUser?.email;

  const [profiles, setProfiles] = useState<Membro[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  });

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>({
    nome: "",
    cargo: "",
    skillsSelecionadas: [],
    nivel: "pleno",
    anosExperiencia: 1,
  });

  const myProfile = useMemo(
    () => profiles.find((p) => p.userId === userId),
    [profiles, userId]
  );

  function saveProfile() {
    if (!userId) return;

    const newProfile: Membro = {
      id: myProfile?.id || Date.now(),
      userId,
      nome: form.nome,
      cargo: form.cargo,
      skills: form.skillsSelecionadas.map((skill) => ({
        nome: skill,
        nivel: form.nivel,
        anosExperiencia: form.anosExperiencia,
      })),
    };

    setProfiles((prev) => {
      const exists = prev.some((p) => p.userId === userId);

      const updated = exists
        ? prev.map((p) => (p.userId === userId ? newProfile : p))
        : [...prev, newProfile];

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    setShowForm(false);
  }

  function deleteProfile() {
    setProfiles((prev) => {
      const updated = prev.filter((p) => p.userId !== userId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    setShowForm(false);
  }

  function leaveRoom() {
    navigate("/");
  }

  return (
    <div className="skill-manager">

      <header className="skill-header">
        <h1>Skill Manager</h1>
        <div>Team {teamId}</div>
      </header>

      <div className="layout">

        <section className="panel large">
          <h2>Equipe</h2>

          {profiles.map((m) => (
            <div key={m.id} className="member-card">
              <h3>
                {m.nome} {m.userId === userId && "(você)"}
              </h3>

              <p>{m.cargo}</p>

              <div className="skills">
                {m.skills.map((s) => (
                  <span key={s.nome}>
                    {s.nome} ({s.nivel})
                  </span>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="panel small">
          <h2>Perfil</h2>

          {!myProfile ? (
            <button onClick={() => setShowForm(true)}>
              Criar perfil
            </button>
          ) : (
            <>
              <button onClick={() => setShowForm(true)}>
                Editar
              </button>

              <button className="danger" onClick={deleteProfile}>
                Excluir
              </button>
            </>
          )}

          {showForm && (
            <div className="form">

              <input
                placeholder="Nome"
                value={form.nome}
                onChange={(e) =>
                  setForm({ ...form, nome: e.target.value })
                }
              />

              <input
                placeholder="Cargo"
                value={form.cargo}
                onChange={(e) =>
                  setForm({ ...form, cargo: e.target.value })
                }
              />

              <select
                value=""
                onChange={(e) =>
                  setForm({
                    ...form,
                    skillsSelecionadas: [
                      ...form.skillsSelecionadas,
                      e.target.value,
                    ],
                  })
                }
              >
                <option value="">Adicionar skill</option>
                {SKILLS_DISPONIVEIS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <button onClick={saveProfile}>Salvar</button>
            </div>
          )}

          <button onClick={leaveRoom}>Sair da sala</button>
        </section>

      </div>
    </div>
  );
}
