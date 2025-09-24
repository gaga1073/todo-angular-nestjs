import { PrismaClient } from '@prisma/client';

export const seedTodo = async (prisma: PrismaClient): Promise<void> => {
  await prisma.todoModel.deleteMany();

  await prisma.todoModel.createMany({
    data: [
      {
        id: '01K4QFS0M9RT1BMCHE86KHNHCZ',
        title: '作業1',
        workspaceId: '01K4QDX4BJPRRFH23T3HWMQ7NC',
        description: '説明テスト',
        status: 'NotStarted',
        dueDate: new Date('2026-09-09T12:00:00+09:00'),
        assigneeId: '01HZYC2028WMB3NJ16WCV9Z9E0',
        createBy: '01HZYC2028WMB3NJ16WCV9Z9E0',
        createAt: new Date('2025-09-09T12:00:00+09:00'),
        updateAt: new Date('2025-09-09T12:00:00+09:00'),
      },
    ],
  });
};
