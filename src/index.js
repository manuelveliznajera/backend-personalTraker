import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import personaRoutes from "./routes/personaRoutes.js";
import departamentoRoutes from "./routes/departamentoRoutes.js";
import municipioRoutes from "./routes/municipioRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

//Editando mi archivo Local y lo enviare a GitHub
const manuel = "Manuel";
// Crear la aplicación de Express
const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/personas", personaRoutes);
app.use("/api/departamentos", departamentoRoutes);
app.use("/api/municipios", municipioRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/auth", authRoutes);
// Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});