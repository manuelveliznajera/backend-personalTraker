// src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";

// Middleware para validar JWT
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // tu secret en .env
    req.user = decoded; // guardamos la info del usuario en req.user
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};