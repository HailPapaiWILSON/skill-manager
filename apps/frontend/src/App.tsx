import React, { useState } from "react";
import "./App.css";
import { useNavigate } from "react-router-dom";

type View = "login" | "register";

type CurrentUser = {
  id: number;
  nome: string;
  email: string;
  senha: string;
  equipeId: number;
};

export default function App() {
  const navigate = useNavigate();
  const [view, setView] = useState<View>("login");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginSenha, setLoginSenha] = useState("");

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [codigoEquipe, setCodigoEquipe] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const saved = localStorage.getItem("currentUser");

    if (!saved) {
      alert("Usuário não encontrado");
      return;
    }

    const user: CurrentUser = JSON.parse(saved);

    if (user.email === loginEmail && user.senha === loginSenha) {
      navigate(`/team/${user.equipeId}`);
    } else {
      alert("Email ou senha inválidos");
    }
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    if (!nome || !email || !senha || !codigoEquipe) {
      alert("Preencha todos os campos");
      return;
    }

    const newUser: CurrentUser = {
      id: Date.now(),
      nome,
      email,
      senha,
      equipeId: Number(codigoEquipe),
    };

    localStorage.setItem("currentUser", JSON.stringify(newUser));

    navigate(`/team/${newUser.equipeId}`);
  }

  return (
    <div className="container">
      <div className="content">

        {view === "login" && (
          <div className="card show">
            <h2>Entrar</h2>

            <form onSubmit={handleLogin}>
              <input
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Senha"
                value={loginSenha}
                onChange={(e) => setLoginSenha(e.target.value)}
              />

              <button className="btn-login">Entrar</button>
            </form>

            <p className="switch">
              Não tem conta?{" "}
              <span onClick={() => setView("register")}>Criar</span>
            </p>
          </div>
        )}

        {view === "register" && (
          <div className="card show">
            <h2>Criar conta</h2>

            <form onSubmit={handleRegister}>
              <input
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />

              <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />

              <input
                placeholder="ID da equipe"
                value={codigoEquipe}
                onChange={(e) => setCodigoEquipe(e.target.value)}
              />

              <button className="btn-register">Cadastrar</button>
            </form>

            <p className="switch">
              Já tem conta?{" "}
              <span onClick={() => setView("login")}>Entrar</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
