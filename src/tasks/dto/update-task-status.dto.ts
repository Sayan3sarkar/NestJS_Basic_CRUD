import { TaskStatus } from '../task-status.enum';

export class UpdateTaskStatusDTO {
  public id: string;
  public status: TaskStatus;
}
