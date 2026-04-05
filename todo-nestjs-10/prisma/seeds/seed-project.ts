import { PrismaClient } from '@prisma/client';

export const seedProject = async (prisma: PrismaClient): Promise<void> => {
  await prisma.projectModel.create({
    data: {
      id: '01k4qdx4bjprrfh23t3hwmq7nc',
      name: 'pulbic project1',
      description: '説明テスト',
      groupId: '01k4qb25x33ahegx765nrdcec9',
      createById: '01hzyc2028wmb3nj16wcv9z9e0',
      createAt: new Date('2025-09-09T12:00:00+09:00'),
      updateAt: new Date('2025-09-09T12:00:00+09:00'),
    },
  });

  await prisma.projectModel.create({
    data: {
      id: '01k4qeqbwqccrhk4q7dycr95aw',
      name: `user1 «private project`,
      description: '説明テスト',
      groupId: '01k8cs5asg8wd66rgazpsmtrbq',
      createById: '01hzyc2028wmb3nj16wcv9z9e0',
      createAt: new Date('2025-09-09T12:00:00+09:00'),
      updateAt: new Date('2025-09-09T12:00:00+09:00'),
    },
  });

  await prisma.projectModel.create({
    data: {
      id: '01k8cs81wde2x4ncg26xw2xtpg',
      name: `user2 «private project»`,
      description: '説明テスト',
      groupId: '01k4qbc1t49z1e3rxsbx1vmw0x',
      createById: '01hzyc2028wmb3nj16wcv9z9e0',
      createAt: new Date('2025-09-09T12:00:00+09:00'),
      updateAt: new Date('2025-09-09T12:00:00+09:00'),
    },
  });

  await prisma.projectModel.create({
    data: {
      id: '01k8cs81p1sjpaj3gr78pc2jff',
      name: `user3 «private project»`,
      description: '説明テスト',
      groupId: '01k8cs3z9aqjxfqnzskcf78hxd',
      createById: '01hzyc2028wmb3nj16wcv9z9e0',
      createAt: new Date('2025-09-09T12:00:00+09:00'),
      updateAt: new Date('2025-09-09T12:00:00+09:00'),
    },
  });
};
