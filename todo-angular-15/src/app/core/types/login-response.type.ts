import { User } from './User.type';

export type LoginResponse = {
  user: User;
  accessToken: string;
};
