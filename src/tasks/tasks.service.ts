import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { TaskStatus } from './task-status.enum';
import { CreateTaskDTO } from './dto/create-task.dto';
// import { UpdateTaskStatusDTO } from './dto/update-task-status.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  /**
   * Fetches all Tasks(with or without filters)
   * @returns Task[]
   */
  public getTasks(filterDTO: GetTasksFilterDTO, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDTO, user);
  }

  /**
   * Fetches a single Task by ID
   * @param id
   * @returns Task
   */
  public async getTaskById(id: number, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!task) {
      throw new NotFoundException(`Could not find task with ID ${id}`);
    }
    return task;
  }

  /**
   * Create a new Task
   * @param createTaskDTO
   * @returns Task
   */
  public async createTask(
    createTaskDTO: CreateTaskDTO,
    user: User,
  ): Promise<Task> {
    return this.taskRepository.createTask(createTaskDTO, user);
  }

  /**
   * Delete a task by ID
   * @param id
   */
  public async deleteTaskById(id: number, user: User): Promise<void> {
    // const task = await this.getTaskById(id); // Fetching the task from database by ID
    // await this.taskRepository.remove(task); // In 'remove' we need to fetch the task from database and then remove it.
    // So it's expensive from a performance point of view
    const result = await this.taskRepository.delete({ id, userId: user.id }); // In 'delete', we just need to pass the id of the task to be deleted
    if (result.affected === 0) {
      throw new NotFoundException(`Could not find task with ID ${id}`);
    }
  }

  /**
   * Updates status of a task by ID
   * @param id
   * @param status
   * @returns Promise<Task>
   */
  public async updateTaskById(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await task.save();
    return task;
  }
}
