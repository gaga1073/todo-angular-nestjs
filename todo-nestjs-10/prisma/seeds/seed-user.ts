import { PrismaClient } from '@prisma/client';

export const seedUser = async (prisma: PrismaClient): Promise<void> => {
  await prisma.user.deleteMany();

  await prisma.user.createMany({
    data: [
      {
        id: '01HZYC2028WMB3NJ16WCV9Z9E0',
        email: 'user@email.com',
        name: '山田',
        password: 'pass',
      },
    ],
  });
};
