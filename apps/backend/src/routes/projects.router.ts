import { Router } from "express";

import {
  listProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../services/projects.service.js";

const router = Router();

router.get("/", async (_req, res) => {
  const projects = await listProjects();

  res.json(projects);
});

router.get("/:id", async (req, res) => {
  const project = await getProjectById(
    Number(req.params.id)
  );

  if (!project) {
    return res.status(404).json({
      error: "Projeto não encontrado",
    });
  }

  res.json(project);
});

router.post("/", async (req, res) => {
  const project = await createProject(req.body);

  res.status(201).json(project);
});

router.put("/:id", async (req, res) => {
  const project = await updateProject(
    Number(req.params.id),
    req.body
  );

  res.json(project);
});

router.delete("/:id", async (req, res) => {
  await deleteProject(Number(req.params.id));

  res.sendStatus(204);
});