import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const handlePrismaError = (
  error: PrismaClientKnownRequestError,
): void => {
  const { code } = error;

  switch (code) {
    case 'P2002':
      throw new ConflictException('対象のデータが存在します');
    case 'P2025':
      throw new NotFoundException('対象のデータが存在しません');
    default:
      throw new InternalServerErrorException('予期せぬエラー');
  }
};
