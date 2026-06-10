import express from "express";
import usersRouter from "./routes/users.routes.js";

const app = express();

app.use(express.json());

app.use("/usuarios", usersRouter);

app.listen(3000);