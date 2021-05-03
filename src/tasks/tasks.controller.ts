import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
// import { UpdateTaskStatusDTO } from './dto/update-task-status.dto';
import { Task, TaskStatus } from './tasks.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  // GET Request to /tasks. View all Tasks and also tasks filtered with query params
  @Get()
  public getTasks(@Query(ValidationPipe) filterDTO: GetTasksFilterDTO): Task[] {
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
  @UsePipes(ValidationPipe)
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
    // @Param() updateTaskStatusDTO: UpdateTaskStatusDTO,
    @Param('id') id: string,
    @Param('status', TaskStatusValidationPipe) status: TaskStatus,
  ): Task {
    // return this.tasksService.updateTaskById(updateTaskStatusDTO);
    return this.tasksService.updateTaskById(id, status);
  }
}
