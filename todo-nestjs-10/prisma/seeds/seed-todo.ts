import { PrismaClient, Status } from '@prisma/client';
import { ulid } from 'ulid';

export const seedTodo = async (prisma: PrismaClient): Promise<void> => {
  let num = 0;
  const data = [...Array(30)].map(() => {
    num++;

    return {
      id: ulid(),
      title: `作業${num}`,
      workspaceId: '01K4QDX4BJPRRFH23T3HWMQ7NC',
      description: '説明テスト',
      status: Status.NotStarted,
      dueDate: new Date('2026-09-09'),
      assigneeId: '01HZYC2028WMB3NJ16WCV9Z9E0',
      createById: '01HZYC2028WMB3NJ16WCV9Z9E0',
      createAt: new Date('2025-09-09T12:00:00+09:00'),
      updateAt: new Date('2025-09-09T12:00:00+09:00'),
    };
  });

  await prisma.todoModel.createMany({
    data: data,
  });
};
