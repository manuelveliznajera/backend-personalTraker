import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todos los departamentos
export const getDepartamentos = async (req, res) => {
  try {
    const departamentos = await prisma.departamento.findMany(
      {
        include: {
          municipio: true, // Trae todos los municipios relacionados
        },
      }
    );
    console.log(departamentos, "departamentos  ")
    res.json(departamentos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un departamento por código con sus municipios
export const getDepartamentoByCodigo = async (req, res) => {
  const { codigo } = req.params;
  try {
    const departamento = await prisma.departamento.findUnique({
      where: { codigo },
      include: { municipios: true }, // trae los municipios relacionados
    });

    if (!departamento) return res.status(404).json({ error: "Departamento no encontrado" });

    res.json(departamento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};