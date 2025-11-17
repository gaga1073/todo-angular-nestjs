import { Global, Module } from '@nestjs/common';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { ClsModule } from 'nestjs-cls';
import { CreateUserDomainService } from '@/core/domain-services/create-user-domain.service';
import { AppLoggerFactory } from '@/core/providers/app-logger.factory';
import { PrismaProvider } from '@/core/providers/prisma.provider';
import { JwtStrategy } from '@/core/strategies/jwt.strategy';
import { LocalStrategy } from '@/core/strategies/login.strategy';
import { RefreshTokenJwtStrategy } from '@/core/strategies/refresh-token-jwt.strategy';
import { AuthModule } from '@/features/auth/auth.module';
import { GroupModule } from '@/features/group/group.module';
import { UserModule } from '@/features/user/user.module';
import { WorkspaceModule } from '@/features/workspace/workspace.module';

@Global()
@Module({
  imports: [
    ClsModule.forRoot({
      plugins: [
        new ClsPluginTransactional({
          // imports: [
          //   // module in which the PrismaClient is provided
          //   PrismaModule,
          // ],
          adapter: new TransactionalAdapterPrisma({
            // the injection token of the PrismaClient
            prismaInjectionToken: PrismaProvider,
            // specify the SQL flavor (if using SQL, see below)
            sqlFlavor: 'postgresql',
          }),
        }),
      ],
    }),
    AuthModule,
    UserModule,
    GroupModule,
    WorkspaceModule,
  ],
  providers: [
    LocalStrategy,
    JwtStrategy,
    RefreshTokenJwtStrategy,
    AppLoggerFactory,
    PrismaProvider,
    CreateUserDomainService,
  ],
  exports: [AppLoggerFactory, PrismaProvider, CreateUserDomainService],
})
export class CoreModule {}
