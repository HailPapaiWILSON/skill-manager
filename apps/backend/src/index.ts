import express from "express";
import usersRouter from "./routes/users.routes.js";
import teamsRouter from "./routes/teams.routes.js"

const app = express();

app.use(express.json());

app.use("/usuarios", usersRouter);
app.use("/equipes", teamsRouter);

app.listen(3000);
