import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  const email = "lopson@superdao.co";
  const address = "0x017007475F9A3eA599EF13133CC9Bcb7374deb38";

  // cleanup the existing database
  await prisma.user.delete({ where: { address } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const user = await prisma.user.create({
    data: {
      email,
      address,
    },
  });

  const form = await prisma.externalForm.create({
    data: {
      name: "SuperDAO",
      tallyId: "3xXEWo",
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
