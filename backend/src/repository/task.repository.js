import Task from "../models/task.model.js";

class TaskRepository {

    /**
     * Get all tasks with pagination
     * @param {number} page - The page number
     * @param {number} limit - The number of items per page
     * @returns {Promise<Array<object>>} - An array of task objects sorted by createdAt.
     * Returns an empty array ([]) if no tasks are found.
     */
    async getTasks(page, limit) {
        return Task.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean();
    }

    /**
     * Get task by ID
     * @param {string} id - The ID of the task
     * @returns {Promise<object>} - A task object.
     * Returns null if the task is not found.
     */
    async getTask(id) {
        return Task.findById(id).lean();
    }

    /**
     * Create a new task
     * @param {object} taskData - The task object
     * @returns {Promise<object>} - A task object.
     */
    async createTask(task) {
        const newTask = new Task(task);
        await newTask.save();
        const taskObject = newTask.toObject();
        return taskObject;
    }

    /**
     * Update a task by ID
     * @param {string} id - The ID of the task
     * @param {object} taskData - The task object
     * @returns {Promise<object>} - A task object.
     * Returns null if the task is not found.
     */
    async updateTask(id, taskData) {
        return Task.findByIdAndUpdate(id, taskData, { new: true, runValidators: true }).lean();
    }

    /**
     * Delete a task by ID
     * @param {string} id - The ID of the task
     * @returns {Promise<object>} - A task object.
     * Returns null if the task is not found.
     */
    async deleteTask(id) {
        return Task.findByIdAndDelete(id).lean();
    }

}

export default new TaskRepository();