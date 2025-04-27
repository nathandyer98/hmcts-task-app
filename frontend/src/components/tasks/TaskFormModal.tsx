import { useState } from 'react'
import {  TaskFormData } from '../../types/tasks'
import toast from 'react-hot-toast';
import { useTaskStore } from '../../store/useTaskStore';
import { X } from 'lucide-react';

const defaultTaskData: TaskFormData = {
    title: '',
    description: '',
    dueDate: new Date(),
    taskStatus: 'To Do'
}

interface TaskFormModalProps {
    onCancel: () => void;
}

const TaskFormModal = ( { onCancel }: TaskFormModalProps) => {
    const { createTask, updateTask, selectedTask, recountTaskCounts } = useTaskStore();

    const [taskData, setTaskData] = useState<TaskFormData>(selectedTask || defaultTaskData);

    const validateForm = () => {
        if (!taskData.title.trim()) return toast.error("Title is required");
        return true;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event?.preventDefault();
      if (!validateForm()) return;

      if (selectedTask) {
        await updateTask(selectedTask._id, taskData);

        setTaskData(defaultTaskData);
        recountTaskCounts();
        onCancel();
        return;
      }
      await createTask(taskData);

      setTaskData(defaultTaskData);
      recountTaskCounts();
      onCancel();
    };

    return (
        <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center bg-black/80 bg-opacity-50 z-10"  onClick={() => onCancel()}>
          <div className="w-full max-w-lg p-6  rounded-lg shadow-lg bg-white text-black z-10" onClick={(e) => e.stopPropagation()}>
          <div className='mb-4 flex justify-between'> 
            <h1 className="text-xl font-semibold">{selectedTask ? "Edit Task" : "Create New Task"} </h1>
              <button
                onClick={onCancel}
                className=" text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                <X size={18} />
              </button>
              </div>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">

              <div className="space-y-2 flex flex-col">
                <label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  value={taskData.title}
                  onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                  placeholder="Enter task title"
                  required
                  className='p-2 border border-gray-300 rounded-md'
                />
              </div>
    
              <div className="space-y-2 flex flex-col">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={taskData.description}
                  onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                  placeholder="Enter task description (optional)"
                  rows={3}
                  className='p-2 border border-gray-300 rounded-md '
                />
              </div>
                
              <div className="space-y-2 flex flex-col">
                <label htmlFor="status">Status</label>
                <select
                  className="select w-full bg-white border border-gray-300 rounded-md"
                  value={taskData.taskStatus}
                  onChange={(e) => setTaskData({ ...taskData, taskStatus: e.target.value })}
                >
                    <option value={"To Do"}>To Do</option>
                    <option value={"In Progress"}>In Progress</option>s
                    <option value={"Complete"}>Complete</option> 
                </select>
              </div>
    
              <div className="space-y-2 flex flex-col">
                <label htmlFor="dueDate">Due Date & Time</label>
                <input
                  id="dueDate"
                  type="datetime-local"
                  value={selectedTask ? new Date(selectedTask.dueDate).toISOString().slice(0, 16) : taskData.dueDate ? taskData.dueDate.toISOString().slice(0, 16) : ""}
                  onChange={(e) => setTaskData({ ...taskData, dueDate: new Date(e.target.value) })}
                  className='p-2 border border-gray-300 rounded-md text-black'
                />
              </div>
    
              <div className="flex justify-end space-x-4">
                <button className='btn bg-gray-200 text-black border-gray-50' type="button" onClick={onCancel}>
                  Cancel
                </button>
                <button className='btn text-white bg-black/80 border-0' type="submit">{selectedTask ? "Update Task" : "Create Task"}</button>
                </div>
            </form>
          </div>
        </div>
      )
}

export default TaskFormModal