import { Global, Module } from '@nestjs/common';
import { DeprovisionProjectService } from '@/core/application/services/deprovision-project.service';
import { DeprovisionUserService } from '@/core/application/services/deprovision-user.service';
import { ProvisionUserService } from '@/core/application/services/provision-user.service';
import { AuthModule } from '@/features/auth/auth.module';
import { GroupModule } from '@/features/group/group.module';
import { ProjectModule } from '@/features/project/project.module';
import { UserModule } from '@/features/user/user.module';

@Global()
@Module({
  imports: [AuthModule, UserModule, GroupModule, ProjectModule],
  providers: [ProvisionUserService, DeprovisionUserService, DeprovisionProjectService],
  exports: [ProvisionUserService, DeprovisionUserService, DeprovisionProjectService],
})
export class CoreModule {}
