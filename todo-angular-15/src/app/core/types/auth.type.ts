import { UserRole } from './user.type';
// === Response ===
export type AuthMeResponse = {
  id: string;
  username: string;
  role: string;
};

export type LoginResponse = {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
  accessToken: string;
};

// === Request ===
export type LoginRequest = {
  email: string;
  password: string;
};

export type SignupRequest = {
  username: string;
  email: string;
  password: string;
};
