import { Global, Module } from '@nestjs/common';
import { CreateUserDomainService } from '@/core/domain/services/create-user-domain.service';
import { AuthModule } from '@/features/auth/auth.module';
import { GroupModule } from '@/features/group/group.module';
import { UserModule } from '@/features/user/user.module';
import { WorkspaceModule } from '@/features/workspace/workspace.module';

@Global()
@Module({
  imports: [AuthModule, UserModule, GroupModule, WorkspaceModule],
  providers: [CreateUserDomainService],
  exports: [CreateUserDomainService],
})
export class CoreModule {}
