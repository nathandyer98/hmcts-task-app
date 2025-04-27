/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { axiosInstance } from "../services/api-client";
import { Task, TaskFormData } from "../types/tasks";
import toast from "react-hot-toast";
import { TaskStatusTypes } from "../enum/TaskStatusTypes";

interface TaskState {
    tasks: Task[];
    taskCounts: { All: number; ToDo: number; InProgress: number; Complete: number };
    selectedTask: Task | null;

    activeFilter: TaskStatusTypes | "All";

    pageCount: number;

    isFetchingTasks: boolean;
    isCreatingTask: boolean;

    setSelectedTask: (task: Task | null) => void;

    getAllTasks: (page?: number, limit?: number) => Promise<void>;
    getTask: (taskId: string) => Promise<void>;
    createTask: (formData: TaskFormData) => Promise<void>;
    updateTask: (taskId: string, formData: TaskFormData) => Promise<void>;
    deleteTask: (taskId: string) => Promise<void>;
    setFilter: (filter: TaskStatusTypes | "All") => void;

    recountTaskCounts: () => void;
    // updatePageCount: (pageCount: number) => void;
    // searchTasks: (taskIdQuery: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set) => ({
    tasks: [],
    taskCounts: { All: 0, ToDo: 0, InProgress: 0, Complete: 0 },

    selectedTask: null,

    activeFilter: "All",

    pageCount: 0,

    isFetchingTasks: false,
    isCreatingTask: false,

    getAllTasks: async (page?: number, limit?: number) => {
        set({ isFetchingTasks: true });
        try {
            const res = await axiosInstance.get("/tasks", { params: { page, limit } });;
            set({
                tasks: res.data.tasks,
                pageCount: res.data.pageCount,
                taskCounts: {
                    All: res.data.tasks.length,
                    ToDo: res.data.toDoCount,
                    InProgress: res.data.inProgressCount,
                    Complete: res.data.completedCount,
                },
            });
        } catch (error: any) {
            console.log("Error in getAllTasks controller", error);
        } finally {
            set({ isFetchingTasks: false });
        }
    },
    getTask: async (taskId: string) => {
        set({ isFetchingTasks: true });
        try {
            const res = await axiosInstance.get(`/tasks/${taskId}`);
            set({ tasks: [res.data], selectedTask: res.data, pageCount: 1 });
        } catch (error: any) {
            toast.error(error.response.data.message);
            console.log("Error in getTask controller", error);
        } finally {
            set({ isFetchingTasks: false });
        }
    },
    createTask: async (formData: TaskFormData) => {
        set({ isCreatingTask: true });
        try {
            const newTask = await axiosInstance.post("/tasks", formData);
            set((state) => ({
                tasks: [newTask.data, ...state.tasks],
            }))
            toast.success("Task created successfully");
        } catch (error: any) {
            console.log("Error in createTask controller", error);
            toast.error(error.response.data.message);
        } finally {
            set({ isCreatingTask: false });
        }
    },
    updateTask: async (taskId: string, formData: TaskFormData) => {
        try {
            const res = await axiosInstance.put(`/tasks/${taskId}`, formData);
            set((state) => ({
                tasks: state.tasks.map((task) => task._id === taskId ? res.data : task),
                selectedTask: res.data
            }))
            toast.success("Task updated successfully");
        } catch (error: any) {
            console.log("Error in updateTask controller", error);
            toast.error(error.response.data.message);
        }
    },
    deleteTask: async (taskId: string) => {
        try {
            const res = await axiosInstance.delete(`/tasks/${taskId}`);
            set((state) => ({
                tasks: state.tasks.filter((task) => task._id !== taskId),
                selectedTask: null
            }))
            toast.success(res.data);
        } catch (error: any) {
            console.log("Error in deleteTask controller", error);
            toast.error(error.response.data.message);
        }
    },

    // searchTasks: async (taskIdQuery: string) => {
    //     try {
    //         const res = await axiosInstance.get(`/tasks/search/`, { params: { taskIdQuery } });
    //         set({ tasks: res.data.tasks, pageCount: res.data.pageCount });
    //     } catch (error: any) {
    //         console.log("Error in searchTasks controller", error);
    //         toast.error(error.response.data.message);

    //     }
    // },

    setSelectedTask: (task: Task | null) => set({ selectedTask: task }),

    setFilter: (filter: TaskStatusTypes | "All") => set({ activeFilter: filter }),

    recountTaskCounts: () => set((state) => ({
        taskCounts: {
            All: state.tasks.length,
            ToDo: state.tasks.filter(task => task.taskStatus === "To Do").length,
            InProgress: state.tasks.filter(task => task.taskStatus === "In Progress").length,
            Complete: state.tasks.filter(task => task.taskStatus === "Complete").length,
        }
    })),

    // updatePageCount: (pageCount: number) => set({ pageCount }),

}))

interface selectFilteredTasksProps {
    tasks: Task[];
    activeFilter: TaskStatusTypes | "All";
}

export const selectFilteredTasks = (state: selectFilteredTasksProps) => {
    const { tasks, activeFilter } = state;

    if (activeFilter === 'All') {
        return tasks;
    }

    return tasks.filter(task => task.taskStatus === TaskStatusTypes[activeFilter]);
};