import TaskRepository from "../repository/task.repository.js";
import { NotFoundError } from '../errors/applicationErrors.js';

export const getTasks = async ({ page, limit }) => {
    const tasks = await TaskRepository.getTasks(page, limit);
    return tasks
};

export const getTask = async (id) => {
    const task = await TaskRepository.getTask(id);
    if (!task) throw new NotFoundError("Task not found.");

    return task
};

export const createTask = async (taskData) => {
    const task = await TaskRepository.createTask(taskData);
    return task
};

export const updateTask = async (id, taskData) => {
    const taskToUpdate = await TaskRepository.getTask(id);
    if (!taskToUpdate) throw new NotFoundError("Task not found.");

    const task = await TaskRepository.updateTask(id, taskData);
    return task
};

export const deleteTask = async (id) => {
    const taskToUpdate = await TaskRepository.getTask(id);
    if (!taskToUpdate) throw new NotFoundError("Task not found.");

    const task = await TaskRepository.deleteTask(id);
    return "Task deleted successfully."
};