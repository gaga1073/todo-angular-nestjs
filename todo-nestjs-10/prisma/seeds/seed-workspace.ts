import { PrismaClient } from '@prisma/client';

export const seedWorkspace = async (prisma: PrismaClient): Promise<void> => {
  await prisma.workspaceModel.create({
    data: {
      id: '01K4QDX4BJPRRFH23T3HWMQ7NC',
      name: 'pulbic workspace1',
      description: '説明テスト',
      workspaceClassification: 'public',
      createById: '01HZYC2028WMB3NJ16WCV9Z9E0',
      createAt: new Date('2025-09-09T12:00:00+09:00'),
      updateAt: new Date('2025-09-09T12:00:00+09:00'),
      groups: {
        create: [{ groupId: '01K4QB25X33AHEGX765NRDCEC9', role: 'owner' }],
      },
    },
  });

  await prisma.workspaceModel.create({
    data: {
      id: '01K4QEQBWQCCRHK4Q7DYCR95AW',
      name: `user1 «private workspace»`,
      description: '説明テスト',
      workspaceClassification: 'private',
      createById: '01HZYC2028WMB3NJ16WCV9Z9E0',
      createAt: new Date('2025-09-09T12:00:00+09:00'),
      updateAt: new Date('2025-09-09T12:00:00+09:00'),
      groups: {
        create: [{ groupId: '01K4QB25X33AHEGX765NRDCEC9', role: 'member' }],
      },
    },
  });

  await prisma.workspaceModel.create({
    data: {
      id: '01K8CS81WDE2X4NCG26XW2XTPG',
      name: `user2 «private workspace»`,
      description: '説明テスト',
      workspaceClassification: 'private',
      createById: '01HZYC2028WMB3NJ16WCV9Z9E0',
      createAt: new Date('2025-09-09T12:00:00+09:00'),
      updateAt: new Date('2025-09-09T12:00:00+09:00'),
      groups: {
        create: [{ groupId: '01K4QB25X33AHEGX765NRDCEC9', role: 'member' }],
      },
    },
  });

  await prisma.workspaceModel.create({
    data: {
      id: '01K8CS81P1SJPAJ3GR78PC2JFF',
      name: `user3 «private workspace»`,
      description: '説明テスト',
      workspaceClassification: 'private',
      createById: '01HZYC2028WMB3NJ16WCV9Z9E0',
      createAt: new Date('2025-09-09T12:00:00+09:00'),
      updateAt: new Date('2025-09-09T12:00:00+09:00'),
      groups: {
        create: [{ groupId: '01K4QB25X33AHEGX765NRDCEC9', role: 'member' }],
      },
    },
  });
};
