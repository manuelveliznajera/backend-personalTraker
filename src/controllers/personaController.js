import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todas las personas
export const getPersonas = async (req, res) => {
  try {
    let personas;

    // Si el usuario es candidato, filtra por su municipio
    if (req.user.rol === "candidato") {
      personas = await prisma.personas.findMany({
        where: { municipality: req.user.codigo_municipio },
        include: { departamento: true, municipio: true },
      });
    } else {
      personas = await prisma.personas.findMany({
        include: { departamento: true, municipio: true },
      });
    }

    res.json(personas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener personas", detalle: error.message });
  }
};

// Obtener persona por ID
export const getPersonaById = async (req, res) => {
  try {
    const persona = await prisma.personas.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { departamento: true, municipio: true },
    });

    if (!persona) return res.status(404).json({ error: "Persona no encontrada" });

    // Validar que candidato solo vea personas de su municipio
    if (req.user.rol === "candidato" && persona.municipality !== req.user.codigo_municipio) {
      return res.status(403).json({ error: "No autorizado para ver esta persona" });
    }

    res.json(persona);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener persona", detalle: error.message });
  }
};

// Crear nueva persona
export const createPersona = async (req, res) => {
  try {
    const {
      surname,
      firstName,
      phone,
      dpi,
      address,
      birthDate,
      age,
      gender,
      department,
      municipality,
      community,
      confidenceLevel,
    } = req.body;

    // Candidato solo puede agregar personas en su municipio
    if (req.user.rol === "candidato" && municipality !== req.user.codigo_municipio) {
      return res.status(403).json({ error: "No autorizado para agregar en este municipio" });
    }

    const persona = await prisma.personas.create({
      data: {
        surname,
        firstName,
        phone,
        dpi,
        address,
        birthDate: birthDate ? new Date(birthDate) : null,
        age,
        gender,
        department,
        municipality,
        community,
        confidenceLevel,
      },
    });

    res.json(persona);
  } catch (error) {
    res.status(500).json({ error: "Error al crear persona", detalle: error.message });
  }
};

// Actualizar persona
export const updatePersona = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { surname, firstName, phone, dpi, address, birthDate, age, gender, department, municipality, community, confidenceLevel } = req.body;

    const personaExistente = await prisma.personas.findUnique({ where: { id } });

    if (!personaExistente) return res.status(404).json({ error: "Persona no encontrada" });

    // Candidato solo puede actualizar personas de su municipio
    if (req.user.rol === "candidato" && personaExistente.municipality !== req.user.codigo_municipio) {
      return res.status(403).json({ error: "No autorizado para actualizar esta persona" });
    }

    const persona = await prisma.personas.update({
      where: { id },
      data: {
        surname,
        firstName,
        phone,
        dpi,
        address,
        birthDate: birthDate ? new Date(birthDate) : null,
        age,
        gender,
        department,
        municipality,
        community,
        confidenceLevel,
      },
    });
    console.log(persona)

    res.json(persona);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error al actualizar persona", detalle: error.message });
  }
};

// Eliminar persona
export const deletePersona = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const personaExistente = await prisma.personas.findUnique({ where: { id } });

    if (!personaExistente) return res.status(404).json({ error: "Persona no encontrada" });

    // Candidato no puede eliminar
    if (req.user.rol === "candidato") {
      return res.status(403).json({ error: "No autorizado para eliminar personas" });
    }

    await prisma.personas.delete({ where: { id } });

    res.json({ message: "Persona eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar persona", detalle: error.message });
  }
};