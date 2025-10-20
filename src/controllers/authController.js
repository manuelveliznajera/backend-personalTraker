import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET ; // Cambia en producción
const JWT_EXPIRES_IN = "1h"; // Tiempo de expiración del token

// Login de usuario
export const loginUsuario = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar usuario por email
    const usuario = await prisma.usuarios.findUnique({
      where: { email },
      include: { roles: true, municipio: true }
    });

    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, usuario.password);
    if (!validPassword) return res.status(401).json({ error: "Contraseña incorrecta" });

    // Actualizar ultimo inicio de sesión
    await prisma.usuarios.update({
      where: { id: usuario.id },
      data: { ultimo_inicio_sesion: new Date() },
    });

    // Generar JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.roles.nombre,
        codigo_municipio: usuario.codigo_municipio
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      message: "Login exitoso",
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.roles.nombre,
        codigo_municipio: usuario.codigo_municipio,
        ultimo_inicio_sesion: usuario.ultimo_inicio_sesion
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el login" });
  }
};