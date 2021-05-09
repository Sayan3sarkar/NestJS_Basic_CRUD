import { EntityRepository, Repository } from 'typeorm';

import { User } from 'src/auth/user.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  /**
   * Create a new Task
   * @param createTaskDTO
   * @returns Task
   */
  public async createTask(
    createTaskDTO: CreateTaskDTO,
    user: User,
  ): Promise<Task> {
    const { description, title } = createTaskDTO;
    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;
    await task.save();
    return task;
  }

  public async getTasks(
    filterDTO: GetTasksFilterDTO,
    user: User,
  ): Promise<Task[]> {
    const { search, status } = filterDTO;
    const query = this.createQueryBuilder('task');

    // console.log(user);

    query.where('task.userId = :userId', { userId: user.id });

    // NOTE: We could have used 'where' method of query builder as SQL WHERE clause but that would have overridden all
    // previous conditions set with 'WHERE' clause. 'andWhere' allows multiple WHERE clause to work together
    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
      // Putting % before and after the 'search' variable makes it flexible to five results based on substrings,whitespaces, etc
    }

    return await query.getMany();
  }
}
