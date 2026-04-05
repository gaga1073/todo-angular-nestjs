import { Exclude } from 'class-transformer';
import { ProjectDto } from '@/features/project/dto/response/project.dto';

@Exclude()
export class PostProjectResponse extends ProjectDto {}
