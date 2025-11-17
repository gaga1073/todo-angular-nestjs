import { Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { TodoController } from '@/features/todo/controllers/todo.controller';
import { TodoQueryService } from '@/features/todo/services/todo-query.service';

@Module({
  imports: [ClsModule],
  controllers: [TodoController],
  providers: [TodoQueryService],
})
export class TodoModule {}
