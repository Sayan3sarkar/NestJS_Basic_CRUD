import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { v1 as uuid } from 'uuid';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskStatusDTO } from './dto/update-task-status.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  /**
   * Fetches all Tasks
   * @returns Task[]
   */
  public getAllTasks(): Task[] {
    return this.tasks;
  }

  /**
   * Fetches all tasks which are filtered based on status or a search string
   * @param filterDTO
   * @returns Task[]
   */
  public getTasksWithFilters(filterDTO: GetTasksFilterDTO): Task[] {
    const { search, status } = filterDTO;
    let tasks = this.getAllTasks();
    if (status) {
      tasks = tasks.filter((t) => t.status === status);
    }
    if (search) {
      tasks = tasks.filter(
        (t) => t.title.includes(search) || t.description.includes(search),
      );
    }
    return tasks;
  }

  /**
   * Fetches a single Task by ID
   * @param id
   * @returns Task
   */
  public getTaskById(id: string): Task {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) {
      throw new NotFoundException(`No Task with ID: ${id} found`);
    }
    return task;
  }

  /**
   * Create a new Task
   * @param createTaskDTO
   * @returns Task
   */
  public createTask(createTaskDTO: CreateTaskDTO): Task {
    const { title, description } = createTaskDTO;
    const newTask: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(newTask);
    return newTask;
  }

  /**
   * Delete a task by ID
   * @param id
   */
  public deleteTaskById(id: string): void {
    const task = this.getTaskById(id);
    this.tasks.splice(this.tasks.indexOf(task), 1);
  }

  /**
   * Updates status of a task by ID
   * @param updateTaskStatusDTO
   * @returns Task
   */
  // public updateTaskById(updateTaskStatusDTO: UpdateTaskStatusDTO): Task {
  public updateTaskById(id: string, status: TaskStatus): Task {
    // const { id, status } = updateTaskStatusDTO;
    const updatedTask = this.getTaskById(id);
    updatedTask.status = status;
    return updatedTask;
  }
}
