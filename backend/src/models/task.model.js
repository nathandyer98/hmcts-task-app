import mongoose from "mongoose";

export const TaskStatusEnum = ["To Do", "In Progress", "Completed"];

const taskSchema = new mongoose.Schema({
    caseId: {
        type: String,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    taskStatus: {
        type: String,
        default: "To Do",
        enum: TaskStatusEnum,
    },
    dueDate: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Task = mongoose.model("Task", taskSchema);

export default Task;