import { NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';

export class RequestIDMiddleware implements NestMiddleware {
  use(req: FastifyRequest['raw'], reply: FastifyReply, next: () => void): void {
    const requestId = req.headers['x-request-id'];

    next();
  }
}
