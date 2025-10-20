import express from "express";
import { getMunicipios, getMunicipiosPorDepartamento } from "../controllers/municipioController.js";

const router = express.Router();

// Todos los municipios
router.get("/", getMunicipios);

// Municipios de un departamento específico
router.get("/departamento/:codigoDepartamento", getMunicipiosPorDepartamento);

export default router;