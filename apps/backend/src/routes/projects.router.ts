import { Router } from "express";

import {
  listProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../services/projects.service.js";

const router = Router();