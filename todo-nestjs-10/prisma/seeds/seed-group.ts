import { PrismaClient } from '@prisma/client';

export const seedGroup = async (prisma: PrismaClient): Promise<void> => {
  await prisma.groupModel.createMany({
    data: [
      {
        id: '01K4QB25X33AHEGX765NRDCEC9',
        name: 'group1',
        description: '説明テスト',
        createAt: new Date('2025-09-09T12:00:00+09:00'),
        updateAt: new Date('2025-09-09T12:00:00+09:00'),
      },
      {
        id: '01K4QBC1T49Z1E3RXSBX1VMW0X',
        name: 'group2',
        description: '説明テスト',
        createAt: new Date('2025-09-09T12:00:00+09:00'),
        updateAt: new Date('2025-09-09T12:00:00+09:00'),
      },
    ],
  });

  await prisma.groupModel.update({
    where: { id: '01K4QB25X33AHEGX765NRDCEC9' },
    data: {
      users: {
        create: [
          {
            userId: '01HZYC2028WMB3NJ16WCV9Z9E0',
            role: 'owner',
            createAt: new Date('2025-09-09T12:00:00+09:00'),
            updateAt: new Date('2025-09-09T12:00:00+09:00'),
          },
        ],
      },
    },
  });

  await prisma.groupModel.update({
    where: { id: '01K4QBC1T49Z1E3RXSBX1VMW0X' },
    data: {
      users: {
        create: [
          {
            userId: '01K4QB1SM3FQSZ38DG1VTWSWD9',
            role: 'owner',
            createAt: new Date('2025-09-09T12:00:00+09:00'),
            updateAt: new Date('2025-09-09T12:00:00+09:00'),
          },
        ],
      },
    },
  });

  await prisma.groupModel.update({
    where: { id: '01K4QB25X33AHEGX765NRDCEC9' },
    data: {
      users: {
        create: [
          {
            userId: '01K4QD7FP0VK1ABEFHTK6P44BT',
            role: 'member',
            createAt: new Date('2025-09-09T12:00:00+09:00'),
            updateAt: new Date('2025-09-09T12:00:00+09:00'),
          },
        ],
      },
    },
  });
};
