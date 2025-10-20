import express from "express";
import { getDepartamentos, getDepartamentoByCodigo } from "../controllers/departamentoController.js";

const router = express.Router();

// Obtener todos los departamentos
router.get("/", getDepartamentos);

// Obtener un departamento específico con municipios
router.get("/:codigo", getDepartamentoByCodigo);

export default router;