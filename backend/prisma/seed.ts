import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Aucun jeu de données initial n'est nécessaire.
}

main()
  .catch((e) => {
    console.error('❌ Erreur pendant le seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
