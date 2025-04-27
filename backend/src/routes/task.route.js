import express from "express";

import { getTasks, getTask, createTask, updateTask, deleteTask, searchTasks } from "../controllers/task.controller.js";

const router = express.Router();

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: A list of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
router.get("/", getTasks);

router.get("/:id", getTask);

// router.get("/search", searchTasks);

router.post("/", createTask);

router.put("/:id", updateTask);

router.delete("/:id", deleteTask);

export default router;