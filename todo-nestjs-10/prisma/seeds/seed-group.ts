import { PrismaClient } from '@prisma/client';

export const seedGroup = async (prisma: PrismaClient): Promise<void> => {
  await prisma.groupModel.create({
    data: {
      id: '01K4QB25X33AHEGX765NRDCEC9',
      name: 'public group1',
      description: '説明テスト',
      groupClassification: 'public',
      createAt: new Date('2025-09-09T12:00:00+09:00'),
      updateAt: new Date('2025-09-09T12:00:00+09:00'),
      users: {
        create: [
          { userId: '01HZYC2028WMB3NJ16WCV9Z9E0' },
          { userId: '01K4QD7FP0VK1ABEFHTK6P44BT' },
        ],
      },
    },
  });

  await prisma.groupModel.create({
    data: {
      id: '01K8CS5ASG8WD66RGAZPSMTRBQ',
      name: `user1 «private group»`,
      description: '説明テスト',
      groupClassification: 'private',
      createAt: new Date('2025-09-09T12:00:00+09:00'),
      updateAt: new Date('2025-09-09T12:00:00+09:00'),
      users: {
        create: [{ userId: '01HZYC2028WMB3NJ16WCV9Z9E0' }],
      },
    },
  });

  await prisma.groupModel.create({
    data: {
      id: '01K4QBC1T49Z1E3RXSBX1VMW0X',
      name: `user2 «private group»`,
      description: '説明テスト',
      groupClassification: 'private',
      createAt: new Date('2025-09-09T12:00:00+09:00'),
      updateAt: new Date('2025-09-09T12:00:00+09:00'),
      users: {
        create: [{ userId: '01K4QB1SM3FQSZ38DG1VTWSWD9' }],
      },
    },
  });

  await prisma.groupModel.create({
    data: {
      id: '01K8CS3Z9AQJXFQNZSKCF78HXD',
      name: `user3 «private group»`,
      description: '説明テスト',
      groupClassification: 'private',
      createAt: new Date('2025-09-09T12:00:00+09:00'),
      updateAt: new Date('2025-09-09T12:00:00+09:00'),
      users: {
        create: [{ userId: '01K4QD7FP0VK1ABEFHTK6P44BT' }],
      },
    },
  });
};
