import { IncomingMessage } from 'http';
import { JwtService } from '@nestjs/jwt';
import { Params } from 'nestjs-pino';
import { DecodedToken } from '@/shared/types/decode-token.type';

interface PinoHttpRequest extends IncomingMessage {
  remoteAddress: string;
  remotePort: number;
}

export const pinoConfig = async (jwtService: JwtService): Promise<Params> => {
  return {
    pinoHttp: {
      timestamp: () => `,"time":"${new Date().toISOString()}"`,
      transport: {
        targets: [
          {
            target: 'pino-pretty',
            options: {
              singleLine: true,
              translateTime: 'SYS:standard',
              ignore: 'pid,req.headers,req.remoteAddress,req.remotePort,req.query,res.headers',
            },
          },
          {
            target: 'pino/file',
            options: {
              destination: 'logs/out.log',
              mkdir: true,
            },
          },
        ],
      },
      serializers: {
        req(req: PinoHttpRequest) {
          const {
            headers: _headers,
            remoteAddress: _remoteAddress,
            remotePort: _remotePort,
            ...rest
          } = req;

          return rest;
        },
        res(res: IncomingMessage) {
          const { headers: _headers, ...rest } = res;
          return rest;
        },
      },
      customProps: (req: IncomingMessage) => {
        const authHeader = req.headers.authorization;
        const token = authHeader?.replace(/^Bearer\s/, '');
        let userId: string;

        if (token) {
          const payload = jwtService.decode<DecodedToken>(token);
          userId = payload.id;
        } else {
          userId = '';
        }

        return {
          userId: userId,
        };
      },
    },
  };
};
