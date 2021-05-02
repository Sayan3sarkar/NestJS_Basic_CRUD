import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDTO } from './dto/update-task-status.dto';
import { Task } from './tasks.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  // GET Request to /tasks. View all Tasks and also tasks filtered with query params
  @Get()
  public getTasks(@Query() filterDTO: GetTasksFilterDTO): Task[] {
    if (Object.keys(filterDTO).length > 0) {
      return this.tasksService.getTasksWithFilters(filterDTO);
    }
    return this.tasksService.getAllTasks();
  }

  // GET Request to /tasks/:id. View a single task by ID
  @Get('/:id')
  public getTaskById(@Param('id') id: string): Task {
    return this.tasksService.getTaskById(id);
  }

  // POST Request to /tasks. Create a new Task
  @Post()
  public createTask(@Body() createTaskDTO: CreateTaskDTO): Task {
    return this.tasksService.createTask(createTaskDTO);
  }

  // DELETE request to /tasks/:id. Delete a specific task by ID
  @Delete('/:id')
  public deleteTaskById(@Param('id') id: string): void {
    this.tasksService.deleteTaskById(id);
  }

  // PATCH request to /:id/:status. Update Status of a specific task by ID
  @Patch('/:id/:status')
  public updateTaskById(
    @Param() updateTaskStatusDTO: UpdateTaskStatusDTO,
  ): Task {
    return this.tasksService.updateTaskById(updateTaskStatusDTO);
  }
}
