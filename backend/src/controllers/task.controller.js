import * as TaskService from "../services/task.service.js";
import { handleControllerError } from '../utils/errorHandler.js';
import { TaskStatusEnum } from "../models/task.model.js";

export const getTasks = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    try {
        const { tasks, pageCount, toDoCount, inProgressCount, completedCount } = await TaskService.getTasks({ page, limit });
        res.status(200).json({ tasks, pageCount, toDoCount, inProgressCount, completedCount });
    } catch (error) {
        console.log("---Get Tasks Controller Error---", error);
        handleControllerError(error, res)
    }
}

export const getTask = async (req, res) => {
    const { id } = req.params
    try {
        const task = await TaskService.getTask(id);
        res.status(200).json(task);
    } catch (error) {
        console.log("---Get Task Controller Error---", error);
        handleControllerError(error, res)
    }
}

export const createTask = async (req, res) => {
    const taskData = req.body
    if (Object.keys(taskData).length === 0) return res.status(400).json({ message: "No data provided" });

    const { title } = taskData;
    if (!title || !title.trim()) {
        return res.status(400).json({ message: "Title is required" });
    }

    try {
        const task = await TaskService.createTask(taskData);
        res.status(201).json(task);
    } catch (error) {
        console.log("---Create Task Controller Error---", error);
        handleControllerError(error, res)
    }
}

export const updateTask = async (req, res) => {
    const { id } = req.params
    const updates = req.body;

    if (Object.keys(updates).length === 0) return res.status(400).json({ message: "No updates provided" });

    if ("title" in updates) {
        const { title } = updates;
        if (title == null || typeof title !== 'string' || !title.trim()) {
            return res.status(400).json({ message: "Invalid data: If provided, 'title' must be a non-empty string." });
        }
    }

    if ('description' in updates) {
        const { description } = updates;
        if (description != null && (typeof description !== 'string' || !description.trim())) {
            return res.status(400).json({ message: "Invalid data: If provided and not null, 'description' must be a non-empty string." });
        }
    }

    if ('dueDate' in updates) {
        const { dueDate } = updates;
        if (dueDate != null && isNaN(new Date(dueDate).getTime())) {
            return res.status(400).json({ message: "Invalid data: If provided, 'dueDate' must be a valid date representation or null." });
        }
    }

    if ('taskStatus' in updates) {
        const { taskStatus } = updates;
        if (taskStatus == null || typeof taskStatus !== 'string' || !TaskStatusEnum.includes(taskStatus)) {
            return res.status(400).json({ message: `Invalid data: If provided, 'status' must be one of the allowed values (e.g., ${TaskStatusEnum.join(', ')}).` });
        }
    }

    try {
        const task = await TaskService.updateTask(id, updates);
        return res.status(200).json(task);
    } catch (error) {
        console.log("---Update Task Controller Error---", error);
        handleControllerError(error, res)
    }

}

export const deleteTask = async (req, res) => {
    const { id } = req.params
    try {
        const task = await TaskService.deleteTask(id);
        res.status(200).json(task);
    } catch (error) {
        console.log("---Delete Task Controller Error---", error);
        handleControllerError(error, res)
    }
}

export const searchTasks = async (req, res) => {
    const taskIdQuery = req.query.taskIdQuery;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    if (!taskIdQuery || taskIdQuery.trim().length < 2) {
        return res.status(200).json([]);
    }
    const cleanInput = taskIdQuery.replace(/[-\/\\^$*+?.()|[\]{}]/ig, '\\$&').trim();
    try {
        const tasks = await TaskService.searchTasks(cleanInput, { page, limit });
        res.status(200).json(tasks);
    } catch (error) {
        console.log("---Search Tasks Controller Error---", error);
        handleControllerError(error, res)
    }
}