import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

// Obtener todos los usuarios
export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuarios.findMany({
      include: {
        municipio: true,
        roles: true,
      },
    });
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

// Obtener un usuario por ID
export const getUsuarioById = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await prisma.usuarios.findUnique({
      where: { id: parseInt(id) },
      include: { municipio: true, roles: true },
    });
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
};

// Crear un nuevo usuario
export const createUsuario = async (req, res) => {
 const { role_id, email, password, codigo_municipio } = req.body;

  try {
    // Verificar que no exista otro usuario con el mismo email
    const emailExist = await prisma.usuarios.findUnique({ where: { email } });
    if (emailExist) return res.status(400).json({ error: "El email ya está registrado" });

    // Verificar que no exista otro usuario con el mismo codigo_municipio
    const municipioExist = await prisma.usuarios.findFirst({
      where: { codigo_municipio }
    });
    if (municipioExist) return res.status(400).json({ error: "El código de municipio ya está asignado a otro usuario" });

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const usuario = await prisma.usuarios.create({
      data: {
        role_id,
        email,
        password: hashedPassword,
        codigo_municipio,
      },
    });

    res.status(201).json(usuario);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear usuario" });
  }
};

// Actualizar un usuario
export const updateUsuario = async (req, res) => {
  const { id } = req.params;
  const { role_id, email, password, codigo_municipio, ultimo_inicio_sesion } = req.body;
  try {
    const usuario = await prisma.usuarios.update({
      where: { id: parseInt(id) },
      data: { role_id, email, password, codigo_municipio, ultimo_inicio_sesion },
    });
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

// Eliminar un usuario
export const deleteUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.usuarios.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};