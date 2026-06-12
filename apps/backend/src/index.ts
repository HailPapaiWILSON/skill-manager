import express from "express";
import usersRouter from "./routes/users.routes.js";
import teamsRouter from "./routes/teams.routes.js"
import categoriesRouter from "./routes/categories.router.js"

const app = express();

app.use(express.json());

app.use("/usuarios", usersRouter);
app.use("/equipes", teamsRouter);
app.use("/categorias", categoriesRouter);

app.listen(3000);
