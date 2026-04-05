import { Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { TodoController } from '@/features/todo/controllers/todo.controller';
import { ITodoRepositoryToken } from '@/features/todo/domain/repositories/todo-repository.interface';
import { TodoRepository } from '@/features/todo/infrastructures/repositories/todo.repository';
import { TodoCommandService } from '@/features/todo/services/todo-command.service';
import { TodoQueryService } from '@/features/todo/services/todo-query.service';
import { ProjectMembershipGuard } from '@/shared/guards/project-membership.guard';

@Module({
  imports: [ClsModule],
  controllers: [TodoController],
  providers: [
    TodoQueryService,
    TodoCommandService,
    ProjectMembershipGuard,
    {
      provide: ITodoRepositoryToken,
      useClass: TodoRepository,
    },
  ],
})
export class TodoModule {}
