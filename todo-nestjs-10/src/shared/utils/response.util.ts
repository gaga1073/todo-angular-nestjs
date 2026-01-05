import { FastifyReply } from 'fastify';
import { JWT_TOKEN } from '@/shared/constants/common.constant';

export function setRefreshTokenToHttpOnlyCookie(reply: FastifyReply, token: string): void {
  reply.setCookie(JWT_TOKEN.refreshTokenKey, token, {
    httpOnly: true,
    path: `/api/auth`,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
    sameSite: 'lax',
    secure: false,
  });
}

export function setAccessTokenToHttpOnlyCookie(reply: FastifyReply, token: string): void {
  reply.setCookie(JWT_TOKEN.accessTokenKey, token, {
    httpOnly: false,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
    sameSite: 'lax',
    secure: false,
  });
}

export function terminateRefreshTokenHttpOnlyCookie(reply: FastifyReply): void {
  reply.clearCookie(JWT_TOKEN.refreshTokenKey, {
    path: `/auth`,
  });
}

export function terminateAccessTokenCookie(reply: FastifyReply): void {
  reply.clearCookie(JWT_TOKEN.accessTokenKey, {
    path: '/',
  });
}
