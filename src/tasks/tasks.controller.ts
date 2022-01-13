import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user-decorator';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private taskService: TasksService) {}
  @Get()
  getTasks(@Query() filterDto: GetTaskFilterDto,@GetUser() user:User): Promise<Task[]> {
    return this.taskService.getTasks(filterDto,user);
  }
  @Get('/:id')
  getTaskById(@Param('id') id: string,@GetUser() user:User): Promise<Task> {
    return this.taskService.getTaskById(id,user);
  }
  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.createTask(createTaskDto,user);
  }
  @Delete('/:id')
  deleteTask(@Param('id') id: string,@GetUser() user): Promise<void> {
    return this.taskService.deleteTask(id,user); 
  }
  @Patch('/:id/status')
  updateTask(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user:User
  ): Promise<Task> {
    let { status } = updateTaskStatusDto;
    return this.taskService.updateTask(id, status,user);
  }
}
