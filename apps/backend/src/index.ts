import express from "express";

import usuariosRouter from "./routes/usuarios.routes.js";
import equipesRouter from "./routes/equipes.routes.js"
import categoriasRouter from "./routes/categorias.routes.js"
import skillsRouter from "./routes/skills.routes.js";
import projetosRouter from "./routes/projetos.routes.js";
import autenticacaoRouter from "./routes/autenticao.routes.js";
import skillsUsuariosRouter from "./routes/skills-usuarios.routes.js"
import skillsProjetosRouter from "./routes/skills-projetos.routes.js"

const app = express();

app.use(express.json());

app.use("/usuarios", usuariosRouter);
app.use("/equipes", equipesRouter);
app.use("/categorias", categoriasRouter);
app.use("/skills", skillsRouter);
app.use("/projetos", projetosRouter);
app.use("/autenticacao", autenticacaoRouter);
app.use("/skills-usuarios", skillsUsuariosRouter);
app.use("/skills-projetos", skillsProjetosRouter);

app.listen(3000);
