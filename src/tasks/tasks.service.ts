import { Get, Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid'
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }
    getTasksWithFilter(filterDto: GetTaskFilterDto): Task[] {
        const { search, status } = filterDto;
        let tasks = this.getAllTasks();
        if (status) {
            tasks = tasks.filter(task => task.status === status);
        }
        if (search) {
            tasks = tasks.filter(task => {
                if (task.title.includes(search) || task.description.includes(search)) {
                    return true
                }
                else return false
            })
        }
        return tasks;
    }

    getTaskById(id: string): Task {
        return this.tasks.find(task => task.id === id);
    }

    createTask(createTaskDto: CreateTaskDto): Task {
        const { title, description } = createTaskDto;
        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN
        }
        this.tasks.push(task);
        return task;
    }

    deleteTask(id: string): Task[] {
        return this.tasks.filter(task => task.id !== id);
    }
    updateTask(id: string, status: TaskStatus): Task {
        let task = this.getTaskById(id);
        if (!task) return null;
        task.status = status
        return task;
    }
}
