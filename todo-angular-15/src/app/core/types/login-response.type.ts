import { User } from './user.type';

export type LoginResponse = {
  user: User;
  accessToken: string;
};
