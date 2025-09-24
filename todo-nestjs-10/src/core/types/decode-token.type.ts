export interface DecodedToken {
  id: string;
  sub?: string;
  iat: number;
  exp: number;
  iss?: string;
}
