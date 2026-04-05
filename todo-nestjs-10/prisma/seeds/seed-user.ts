import { PrismaClient } from '@prisma/client';

export const seedUser = async (prisma: PrismaClient): Promise<void> => {
  await prisma.userModel.createMany({
    data: [
      {
        id: '01hzyc2028wmb3nj16wcv9z9e0',
        name: 'user1',
        email: 'user1@email.com',
        role: 'admin',
        password: '$2b$10$CVm2AnvS5xMXv1XT5QuIxOLy2lIdsmt7HQphRA8/MeLdXTb7H2JAO',
        createAt: new Date('2025-09-09T12:00:00+09:00'),
        updateAt: new Date('2025-09-09T12:00:00+09:00'),
        isDeleted: false,
      },
      {
        id: '01k4qb1sm3fqsz38dg1vtwswd9',
        name: 'user2',
        email: 'user2@email.com',
        role: 'admin',
        password: '$2b$10$CVm2AnvS5xMXv1XT5QuIxOLy2lIdsmt7HQphRA8/MeLdXTb7H2JAO',
        createAt: new Date('2025-09-09T12:00:00+09:00'),
        updateAt: new Date('2025-09-09T12:00:00+09:00'),
        isDeleted: false,
      },
      {
        id: '01k4qd7fp0vk1abefhtk6p44bt',
        name: 'user3',
        email: 'user3@email.com',
        role: 'general',
        password: '$2b$10$CVm2AnvS5xMXv1XT5QuIxOLy2lIdsmt7HQphRA8/MeLdXTb7H2JAO',
        createAt: new Date('2025-09-09T12:00:00+09:00'),
        updateAt: new Date('2025-09-09T12:00:00+09:00'),
        isDeleted: false,
      },
    ],
  });
};
