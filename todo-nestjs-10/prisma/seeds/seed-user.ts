import { PrismaClient } from '@prisma/client';

export const seedUser = async (prisma: PrismaClient): Promise<void> => {
  await prisma.userModel.createMany({
    data: [
      {
        id: '01HZYC2028WMB3NJ16WCV9Z9E0',
        name: 'user1',
        email: 'user1@email.com',
        role: 'admin',
        password: '$2b$10$CVm2AnvS5xMXv1XT5QuIxOLy2lIdsmt7HQphRA8/MeLdXTb7H2JAO',
        createAt: new Date('2025-09-09T12:00:00+09:00'),
        updateAt: new Date('2025-09-09T12:00:00+09:00'),
        isDelete: false,
      },
      {
        id: '01K4QB1SM3FQSZ38DG1VTWSWD9',
        name: 'user2',
        email: 'user2@email.com',
        role: 'admin',
        password: '$2b$10$CVm2AnvS5xMXv1XT5QuIxOLy2lIdsmt7HQphRA8/MeLdXTb7H2JAO',
        createAt: new Date('2025-09-09T12:00:00+09:00'),
        updateAt: new Date('2025-09-09T12:00:00+09:00'),
        isDelete: false,
      },
      {
        id: '01K4QD7FP0VK1ABEFHTK6P44BT',
        name: 'user3',
        email: 'user3@email.com',
        role: 'general',
        password: '$2b$10$CVm2AnvS5xMXv1XT5QuIxOLy2lIdsmt7HQphRA8/MeLdXTb7H2JAO',
        createAt: new Date('2025-09-09T12:00:00+09:00'),
        updateAt: new Date('2025-09-09T12:00:00+09:00'),
        isDelete: false,
      },
    ],
  });
};
