import { PrismaClient } from '@prisma/client';

export const seedGroup = async (prisma: PrismaClient): Promise<void> => {
  await prisma.groupModel.create({
    data: {
      id: '01k4qb25x33ahegx765nrdcec9',
      name: 'public group1',
      description: '説明テスト',
      groupClassification: 'public',
      createAt: new Date('2025-09-09T12:00:00+09:00'),
      updateAt: new Date('2025-09-09T12:00:00+09:00'),
      users: {
        create: [
          { userId: '01hzyc2028wmb3nj16wcv9z9e0' },
          { userId: '01k4qd7fp0vk1abefhtk6p44bt' },
        ],
      },
    },
  });

  await prisma.groupModel.create({
    data: {
      id: '01k8cs5asg8wd66rgazpsmtrbq',
      name: `user1 «private group»`,
      description: '説明テスト',
      groupClassification: 'private',
      createAt: new Date('2025-09-09T12:00:00+09:00'),
      updateAt: new Date('2025-09-09T12:00:00+09:00'),
      users: {
        create: [{ userId: '01hzyc2028wmb3nj16wcv9z9e0' }],
      },
    },
  });

  await prisma.groupModel.create({
    data: {
      id: '01k4qbc1t49z1e3rxsbx1vmw0x',
      name: `user2 «private group»`,
      description: '説明テスト',
      groupClassification: 'private',
      createAt: new Date('2025-09-09T12:00:00+09:00'),
      updateAt: new Date('2025-09-09T12:00:00+09:00'),
      users: {
        create: [{ userId: '01k4qb1sm3fqsz38dg1vtwswd9' }],
      },
    },
  });

  await prisma.groupModel.create({
    data: {
      id: '01k8cs3z9aqjxfqnzskcf78hxd',
      name: `user3 «private group»`,
      description: '説明テスト',
      groupClassification: 'private',
      createAt: new Date('2025-09-09T12:00:00+09:00'),
      updateAt: new Date('2025-09-09T12:00:00+09:00'),
      users: {
        create: [{ userId: '01k4qd7fp0vk1abefhtk6p44bt' }],
      },
    },
  });
};
