import { TaskStatus } from '../tasks.model';

export class UpdateTaskStatusDTO {
  public id: string;
  public status: TaskStatus;
}
