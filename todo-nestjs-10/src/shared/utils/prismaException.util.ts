import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export function handlePrismaError(error: unknown): never {
  if (error instanceof PrismaClientKnownRequestError) {
    const { code } = error;
    switch (code) {
      case 'P2002':
        throw new ConflictException('The specified data already exists');
      case 'P2025':
        throw new NotFoundException('The specified data was not found');
      default:
        throw new InternalServerErrorException('An unexpected database error occurred');
    }
  }

  throw new InternalServerErrorException('An unexpected database error occurred');
}
