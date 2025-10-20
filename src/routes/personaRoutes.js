// src/routes/personas.routes.js
import { Router } from "express";
import {
  getPersonas,
  getPersonaById,
  createPersona,
  updatePersona,
  deletePersona,
} from "../controllers/personaController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

// Todas las rutas protegidas con JWT
router.use(authMiddleware);

router.get("/", getPersonas);
router.get("/:id", getPersonaById);
router.post("/", createPersona);
router.put("/:id", updatePersona);
router.delete("/:id", deletePersona);

export default router;