import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Member {
  id: number;
  nome: string;
  email: string;
}

interface Team {
  id: number;
  nome: string;
  membros: Member[];
}

export default function TeamDashboard() {
  const { teamId } = useParams<{ teamId: string }>();

  const [team, setTeam] = useState<Team | null>(null);

  useEffect(() => {
    async function carregarEquipe() {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:3000/teams/${teamId}`, {
          method: "GET",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        console.log("Dados da equipe:", data);

        if (!response.ok) {
          alert(data.message || "Erro ao buscar equipe");

          return;
        }

        setTeam(data);
      } catch (error) {
        console.error("Erro ao carregar equipe:", error);
      }
    }

    console.log("ID DO TIME:", teamId);

    if (teamId) {
      carregarEquipe();
    }
  }, [teamId]);

  if (!team) {
    return <h2>Carregando equipe...</h2>;
  }

  return (
    <div className="team-container">
      <h1>{team.nome}</h1>

      <h3>Membros: {team.membros?.length || 0}</h3>

      <div className="members">
        {team.membros?.map((member) => (
          <div key={member.id} className="member-card">
            <h3>{member.nome}</h3>

            <p>{member.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
