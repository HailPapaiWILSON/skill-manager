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