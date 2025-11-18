import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaProvider } from '@/shared/providers/prisma.provider';
import { GetGroupResponse } from '@/features/group/dto/response/get-group.response';

@Injectable()
export class GroupQueryService {
  constructor(private readonly prisma: PrismaProvider) {}

  public async getGroup(groupId: string): Promise<GetGroupResponse> {
    const row = await this.prisma.groupModel.findUniqueOrThrow({
      where: {
        id: groupId,
      },
      include: {
        users: true,
      },
    });

    return plainToInstance(GetGroupResponse, row);
  }
}

// {
//   id: '01K4QB25X33AHEGX765NRDCEC9',
//   name: 'group1',
//   description: '説明テスト',
//   createAt: 2025-09-09T03:00:00.000Z,
//   updateAt: 2025-09-09T03:00:00.000Z,
//   users: [
//     {
//       userId: '01HZYC2028WMB3NJ16WCV9Z9E0',
//       groupId: '01K4QB25X33AHEGX765NRDCEC9',
//       role: 'owner',
//       createAt: 2025-09-09T03:00:00.000Z,
//       updateAt: 2025-09-09T03:00:00.000Z
//     },
//     {
//       userId: '01K4QD7FP0VK1ABEFHTK6P44BT',
//       groupId: '01K4QB25X33AHEGX765NRDCEC9',
//       role: 'member',
//       createAt: 2025-09-09T03:00:00.000Z,
//       updateAt: 2025-09-27T03:00:00.000Z
//     }
//   ]
// }
