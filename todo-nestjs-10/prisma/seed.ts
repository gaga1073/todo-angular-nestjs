import { PrismaClient } from '@prisma/client';
import { seedGroup } from './seeds/seed-group';
import { seedProject } from './seeds/seed-project';
import { seedTodo } from './seeds/seed-todo';
import { seedUser } from './seeds/seed-user';

const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`
  TRUNCATE TABLE 
    "todos",
    "projects",
    "user_groups",
    "groups",
    "users"
  RESTART IDENTITY CASCADE
`);

  await seedUser(prisma);
  await seedGroup(prisma);
  await seedProject(prisma);
  await seedTodo(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
