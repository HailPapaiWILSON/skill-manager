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