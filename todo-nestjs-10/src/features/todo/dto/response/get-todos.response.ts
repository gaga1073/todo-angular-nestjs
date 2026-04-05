import { Exclude } from 'class-transformer';
import { TodoDto } from '@/features/todo/dto/response/todo.dto';

@Exclude()
export class GetTodosResponse extends TodoDto {}
