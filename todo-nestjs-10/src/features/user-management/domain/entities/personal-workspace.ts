import { Entity } from '@/core/base-class/domain/entity';
import { Ulid } from '@/core/base-class/domain/ulid';

type PersonalWorkspaceProps = {
  name: string;
  todos: Ulid[];
};

export class PersonalWorkspace extends Entity<Ulid, PersonalWorkspaceProps> {
  private constructor(id: Ulid, props: PersonalWorkspaceProps) {
    super(id, props);
  }
  public get name(): string {
    return this.props.name;
  }

  public get todos(): Ulid[] {
    return this.props.todos;
  }

  public static create({ username }: { username: string; ownerId: Ulid }): PersonalWorkspace {
    const name = `${username}'s workspace`;
    const todos: Ulid[] = [];
    return new PersonalWorkspace(new Ulid(), { name, todos });
  }

  public static restore({
    id,
    name,
    todos,
  }: {
    id: Ulid;
    name: string;
    todos: Ulid[];
  }): PersonalWorkspace {
    return new PersonalWorkspace(id, { name, todos });
  }
}
