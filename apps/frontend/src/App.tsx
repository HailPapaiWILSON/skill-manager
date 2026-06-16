import React, { useState } from "react";
import "./App.css";
import { useNavigate } from "react-router-dom";

type View = "login" | "register";

export default function App() {
  const navigate = useNavigate();

  const [view, setView] = useState<View>("login");

  // LOGIN
  const [loginEmail, setLoginEmail] = useState("");
  const [loginSenha, setLoginSenha] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // CADASTRO
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [codigoEquipe, setCodigoEquipe] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const usuarioSalvo = localStorage.getItem("usuario");

    console.log("Encontrado:", usuarioSalvo);

    if (!usuarioSalvo) {
      alert("Usuário não cadastrado");

      return;
    }

    const usuario = JSON.parse(usuarioSalvo);

    if (usuario.email === loginEmail && usuario.senha === loginSenha) {
      navigate(`/team/${usuario.teamId}`);
    } else {
      alert("Dados incorretos");
    }
  };
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome || !email || !senha || !codigoEquipe) {
      alert("Preencha todos os campos");
      return;
    }

    const usuario = {
      id: Date.now(),
      nome,
      email,
      senha,
      teamId: codigoEquipe.toUpperCase(),
    };

    localStorage.setItem("usuario", JSON.stringify(usuario));

    console.log("Usuário salvo:", usuario);

    navigate(`/team/${usuario.teamId}`);
  };
  return (
    <div className="container">
      <video autoPlay loop muted playsInline className="background-video">
        <source src="/minecraft-sunset.1920x1080.mp4" type="video/mp4" />
      </video>

      <div className="overlay" />

      <div className="content">
        {/* LOGIN */}
        <div className={`card ${view === "login" ? "show" : "hide"}`}>
          <h2>Entrar</h2>
          <p className="subtitle">Bem-vindo de volta</p>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />

            {/* SENHA LOGIN COM OLHO */}
            <div className="password-wrapper">
              <input
                type={showLoginPassword ? "text" : "password"}
                placeholder="Senha"
                value={loginSenha}
                onChange={(e) => setLoginSenha(e.target.value)}
              />

              <button
                type="button"
                className="eye-button"
                onClick={() => setShowLoginPassword(!showLoginPassword)}
              >
                {showLoginPassword ? (
                  // OLHO ABERTO
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      stroke="white"
                      strokeWidth="2"
                    />
                  </svg>
                ) : (
                  // OLHO FECHADO
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M3 3l18 18" stroke="white" strokeWidth="2" />
                    <path
                      d="M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 2.4-4.4"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <path
                      d="M9.9 4.2C11 4 12 4 12 4c6.5 0 10 8 10 8"
                      stroke="white"
                      strokeWidth="2"
                    />
                  </svg>
                )}
              </button>
            </div>

            <button className="btn-login" type="submit">
              Entrar
            </button>
          </form>

          <p className="switch">
            Não possui uma conta?{" "}
            <span onClick={() => setView("register")}>Cadastre-se</span>
          </p>
        </div>

        {/* CADASTRO */}
        <div className={`card ${view === "register" ? "show" : "hide"}`}>
          <h2>Criar conta</h2>
          <br />

          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* SENHA CADASTRO COM OLHO */}
            <div className="password-wrapper">
              <input
                type={showRegisterPassword ? "text" : "password"}
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />

              <button
                type="button"
                className="eye-button"
                onClick={() => setShowRegisterPassword(!showRegisterPassword)}
              >
                {showRegisterPassword ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      stroke="white"
                      strokeWidth="2"
                    />
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M3 3l18 18" stroke="white" strokeWidth="2" />
                    <path
                      d="M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 2.4-4.4"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <path
                      d="M9.9 4.2C11 4 12 4 12 4c6.5 0 10 8 10 8"
                      stroke="white"
                      strokeWidth="2"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* CÓDIGO DE EQUIPE (corrigido bug do seu código) */}
            <input
              type="text"
              placeholder="Código de equipe"
              value={codigoEquipe}
              onChange={(e) => setCodigoEquipe(e.target.value)}
            />

            <button className="btn-register" type="submit">
              Cadastrar
            </button>
          </form>

          <p className="switch">
            Já possui uma conta?{" "}
            <span onClick={() => setView("login")}>Entrar</span>
          </p>
        </div>
      </div>
    </div>
  );
}
