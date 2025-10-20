import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de 50 personas...");

  // Códigos de departamentos
  const departamentos = ["06", "07"]; // 06 = Guatemala, 07 = Quetzaltenango

  // Municipios por departamento
  const municipiosPorDepto = {
    "06": ["0614", "0604", "0601"], // Guatemala
    "07": ["0701", "0702", "0703"], // Quetzaltenango
  };

  // Datos de ejemplo
  const nombres = ["María", "Juan", "Carlos", "Ana", "José", "Luis", "Carmen", "Miguel"];
  const apellidos = ["González", "Pérez", "Rodríguez", "López", "Hernández", "Martínez"];
  const comunidades = ["La Comunidad", "San Miguel", "Las Flores", "Santa Rosa", "Nueva Esperanza"];
  const genders = ["masculino", "femenino"];
  const confidenceLevels = ["seguro", "indeciso", "no_seguro"]; // enum interno de Prisma

  const personas = Array.from({ length: 50 }).map((_, i) => {
    const depto = departamentos[i % departamentos.length];
    const municipioList = municipiosPorDepto[depto];
    const municipio = municipioList[Math.floor(Math.random() * municipioList.length)];

    const birthYear = 1980 + Math.floor(Math.random() * 25);
    const birthMonth = Math.floor(Math.random() * 12);
    const birthDay = 1 + Math.floor(Math.random() * 28);
    const birthDate = new Date(birthYear, birthMonth, birthDay);
    const age = new Date().getFullYear() - birthDate.getFullYear();

    return {
      surname: apellidos[Math.floor(Math.random() * apellidos.length)],
      firstName: nombres[Math.floor(Math.random() * nombres.length)],
      phone: `5${1000000 + i}`,             // teléfono 8 dígitos
      dpi: `${1000000000000 + i}`,          // DPI único
      address: `Zona ${i % 10}, Ciudad`,
      birthDate,
      age,
      gender: genders[Math.floor(Math.random() * genders.length)],
      department: depto,                    // código de 2 caracteres
      municipality: municipio,              // código de 4 caracteres
      community: comunidades[Math.floor(Math.random() * comunidades.length)],
      confidenceLevel: confidenceLevels[Math.floor(Math.random() * confidenceLevels.length)], // enum correcto
    };
  });

  await prisma.personas.createMany({ data: personas });
  console.log("✅ 50 personas insertadas correctamente.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error("❌ Error en el seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });