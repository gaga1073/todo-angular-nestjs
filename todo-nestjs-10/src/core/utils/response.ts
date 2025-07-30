import { FastifyReply } from 'fastify';
import { jwtToken, path } from '../constants/common.constant';

export const setRefreshTokenToHttpOnlyCookie = (
  reply: FastifyReply,
  token: string,
): void => {
  reply.setCookie(jwtToken.REFRESH_TOKEN_KEY, token, {
    httpOnly: true,

    path: `${path.BASE_URL}/auth/refresh_token`,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
    sameSite: 'strict',
  });
};

export const terminateRefreshTokenHttpOnlyCookie = (
  reply: FastifyReply,
): void => {
  reply.clearCookie(jwtToken.REFRESH_TOKEN_KEY, {
    path: `${path.BASE_URL}/auth/refresh_token`,
  });
};
