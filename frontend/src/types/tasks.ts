export interface Task {
    _id: string;
    title: string;
    description: string;
    taskStatus: string;
    dueDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface TaskFormData {
    title: string;
    description?: string;
    dueDate?: Date;
    taskStatus: string;
}