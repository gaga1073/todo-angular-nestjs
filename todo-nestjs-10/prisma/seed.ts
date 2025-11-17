import { PrismaClient } from '@prisma/client';
import { seedGroup } from './seeds/seed-group';
import { seedTodo } from './seeds/seed-todo';
import { seedUser } from './seeds/seed-user';
import { seedWorkspace } from './seeds/seed-workspace';

const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`
  TRUNCATE TABLE 
    "todos",
    "workspaces",
    "user_groups",
    "group_workspaces",
    "groups",
    "users"
  RESTART IDENTITY CASCADE
`);

  await seedUser(prisma);
  await seedGroup(prisma);
  await seedWorkspace(prisma);
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
