import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todos los municipios
export const getMunicipios = async (req, res) => {
  try {
    const municipios = await prisma.municipio.findMany({
      include: { departamento: true }, // incluye info del departamento al que pertenece
      orderBy: { nombre: "asc" }        // opcional: ordena por nombre
    });
    res.json(municipios);
  } catch (error) {
    console.error("Error al obtener municipios:", error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener municipios de un departamento específico
export const getMunicipiosPorDepartamento = async (req, res) => {
  const { codigoDepartamento } = req.params;
  try {
    const municipios = await prisma.municipio.findMany({
      where: { departamento_codigo: codigoDepartamento },
      orderBy: { nombre: "asc" }
    });
    res.json(municipios);
  } catch (error) {
    console.error("Error al obtener municipios por departamento:", error);
    res.status(500).json({ error: error.message });
  }
};