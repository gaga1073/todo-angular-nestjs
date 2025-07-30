import { User } from './user.type';

export type SignupResponse = {
  user: User;
  accessToken: string;
};
