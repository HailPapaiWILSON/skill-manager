import express from "express";

import usersRouter from "./routes/users.routes.js";
import teamsRouter from "./routes/teams.routes.js"
import categoriesRouter from "./routes/categories.routes.js"
import skillsRouter from "./routes/skills.routes.js";
import projectsRoutes from "./routes/projects.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userSkillsRoutes from "./routes/skills-user.routes.js"
import projectSkillRoutes from "./routes/skills-projects.routes.js"

const app = express();

app.use(express.json());

app.use("/usuarios", usersRouter);
app.use("/equipes", teamsRouter);
app.use("/categorias", categoriesRouter);
app.use("/skills", skillsRouter);
app.use("/projetos", projectsRoutes);
app.use("/auth", authRoutes);
app.use("/user-skill", userSkillsRoutes);
app.use("/project-skills", projectSkillRoutes);

app.listen(3000);
