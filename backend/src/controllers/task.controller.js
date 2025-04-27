import * as TaskService from "../services/task.service.js";
import { handleControllerError } from '../utils/errorHandler.js';
import { TaskStatusEnum } from "../models/task.model.js";

export const getTasks = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try {
        const tasks = await TaskService.getTasks({ page, limit });
        res.status(200).json(tasks);
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
    const { title, description, dueDate } = req.body

    if (!title || !title.trim()) {
        return res.status(400).json({ message: "Title is required" });
    }

    if ((description != null && typeof description === 'string' && !description.trim()) || (dueDate != null && isNaN(new Date(dueDate).getTime()))) {
        return res.status(400).json({ message: "Invalid data" });
    }

    try {
        const task = await TaskService.createTask({ title, description, dueDate });
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