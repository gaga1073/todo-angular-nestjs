import { PrismaClient, Status } from '@prisma/client';
import { ulid } from 'ulid';

export const seedTodo = async (prisma: PrismaClient): Promise<void> => {
  let num = 0;
  const promises = [...Array(30)].map(() => {
    num++;
  });

  prisma.todoModel.createMany({
    data: {
      id: ulid().toLowerCase(),
      title: `作業${num}`,
      projectId: '01k4qdx4bjprrfh23t3hwmq7nc',
      description: '説明テスト',
      status: Status.NotStarted,
      dueDate: new Date('2026-09-09'),
      assigneeId: '01hzyc2028wmb3nj16wcv9z9e0',
      createById: '01hzyc2028wmb3nj16wcv9z9e0',
      createAt: new Date('2025-09-09T12:00:00+09:00'),
      updateAt: new Date('2025-09-09T12:00:00+09:00'),
    },
  });

  await Promise.all(promises);
};
