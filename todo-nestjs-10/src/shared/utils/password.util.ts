import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  try {
    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new UnauthorizedException('Incorrect Username or Password');
    }

    return match;
  } catch (error) {
    throw error;
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};
