import { TaskStatus } from '../tasks.model';

export class GetTasksFilterDTO {
  public status: TaskStatus;
  public search: string;
}
