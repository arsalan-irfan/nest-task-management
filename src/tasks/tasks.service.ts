import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private taskRepository: TasksRepository,
  ) {}

  async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    const tasks = await this.taskRepository.getTasks(filterDto, user);
    return tasks;
  }

  async getTaskById(id: string,user:User): Promise<Task> {
    const found = await this.taskRepository.findOne({id,user});
    if (!found) {
      throw new NotFoundException(`Task with id ${id} not found !`);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: string,user): Promise<void> {
    const result = await this.taskRepository.delete({id,user});
    if (result.affected === 0) {
      throw new NotFoundException(`Task with id ${id} not found !`);
    }
  }
  async updateTask(id: string, status: TaskStatus,user:User): Promise<Task> {
    let task = await this.getTaskById(id,user);
    task.status = status;
    await this.taskRepository.save(task);
    return task;
  }
}
