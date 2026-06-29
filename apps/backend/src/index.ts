import express from "express";
import cors from "cors";
import "dotenv/config.js";

import usuariosRouter from "./routes/usuarios.routes.js";
import equipesRouter from "./routes/equipes.routes.js";
import categoriasRouter from "./routes/categorias.routes.js";
import skillsRouter from "./routes/skills.routes.js";
import projetosRouter from "./routes/projetos.routes.js";
import autenticacaoRouter from "./routes/autenticacao.routes.js";
import skillsUsuariosRouter from "./routes/skills-usuarios.routes.js";
import skillsProjetosRouter from "./routes/skills-projetos.routes.js";
import analyticsRouter from "./routes/analytics.routes.js";

import { autenticar } from "./middleware/auth.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/autenticacao", autenticacaoRouter);

app.use(autenticar);

app.use("/usuarios", usuariosRouter);
app.use("/equipes", equipesRouter);
app.use("/categorias", categoriasRouter);
app.use("/skills", skillsRouter);
app.use("/projetos", projetosRouter);
app.use("/skills-usuarios", skillsUsuariosRouter);
app.use("/skills-projetos", skillsProjetosRouter);
app.use("/analytics", analyticsRouter);

app.listen(3000);
