import { PrismaClient } from '@prisma/client';

export const seedWorkspace = async (prisma: PrismaClient): Promise<void> => {
  await prisma.workspaceModel.createMany({
    data: [
      {
        id: '01K4QDX4BJPRRFH23T3HWMQ7NC',
        name: 'workspace1',
        description: '説明テスト',
        groupId: '01K4QB25X33AHEGX765NRDCEC9',
        ownerId: '01HZYC2028WMB3NJ16WCV9Z9E0',
        createAt: new Date('2025-09-09T12:00:00+09:00'),
        updateAt: new Date('2025-09-09T12:00:00+09:00'),
      },
    ],
  });

  await prisma.workspaceModel.createMany({
    data: [
      {
        id: '01K4QEQBWQCCRHK4Q7DYCR95AW',
        name: 'workspace2',
        description: '説明テスト',
        groupId: null,
        ownerId: '01HZYC2028WMB3NJ16WCV9Z9E0',
        createAt: new Date('2025-09-09T12:00:00+09:00'),
        updateAt: new Date('2025-09-09T12:00:00+09:00'),
      },
    ],
  });
};
