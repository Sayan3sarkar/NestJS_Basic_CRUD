import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { v1 as uuid } from 'uuid';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskStatusDTO } from './dto/update-task-status.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  public getAllTasks(): Task[] {
    return this.tasks;
  }

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

  public getTaskById(id: string): Task {
    return this.tasks.find((t) => t.id === id);
  }

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

  public deleteTaskById(id: string): void {
    this.tasks = this.tasks.filter((t) => t.id !== id);
  }

  public updateTaskById(updateTaskStatusDTO: UpdateTaskStatusDTO): Task {
    const { id, status } = updateTaskStatusDTO;
    const updatedTask = this.getTaskById(id);
    updatedTask.status = status;
    return updatedTask;
  }
}
