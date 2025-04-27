import { CalendarIcon, Clock, Pencil, Trash } from "lucide-react"
import { Task } from "../../types/tasks"
import { formatDate, formatDateTime } from "../../utils/dateTimeFormatter"
import { TaskBadge } from "./TaskListItem"
import { useState } from "react"
import DeleteConfirmationModal from "../common/DeleteConfirmationModal"


interface TaskViewerModalProps {
    taskData: Task
    onCancel: () => void
    onEdit: () => void
}
const TaskViewerModal = ( { taskData, onCancel, onEdit }: TaskViewerModalProps) => {
    const [showDeleteModal, setDeleteModal] = useState(false);

    return (
        <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center bg-black/80 bg-opacity-50" onClick={() => onCancel()}>
        <div className="w-full max-w-lg p-6 rounded-lg shadow-lg bg-white text-black" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex justify-between">
                <h1 className="text-xl font-semibold mb-4 w-[80%]">{taskData.title}</h1>
                <TaskBadge taskStatus={taskData.taskStatus} />
            </div>
            <div className="flex flex-col gap-0.5">
                <p className="text-muted-foreground text-sm font-semibold mt-2">Description</p>
                <p className="text-muted-foreground text-sm mt-2">{taskData.description}</p>
            </div>
            <div className="flex flex-row flex-wrap mb-10">
                <div className="flex flex-col gap-2 mt-2 w-[50%]"> 
                    <p className="text-muted-foreground text-sm font-semibold mt-2">Due Date</p>
                    <div className="flex items-center ">
                        <CalendarIcon className='mr-2 h-4 w-4' />
                        <p className='text-muted-foreground text-sm'>{formatDate(taskData.dueDate)}</p>
                    </div>
                </div>
                <div className="flex flex-col gap-2 mt-2 w-[50%]"> 
                    <p className="text-muted-foreground text-sm font-semibold mt-2">Due Time</p>
                    <div className="flex items-center ">
                        <Clock className='mr-2 h-4 w-4' />
                        <p className='text-muted-foreground text-sm'>{formatDateTime(taskData.dueDate)}</p>
                    </div>
                </div>
                <div className="flex flex-col gap-2 mt-2 w-[50%]"> 
                    <p className="text-muted-foreground text-sm font-semibold mt-2">Created At</p>
                    <div className="flex items-center ">
                        <p className='text-muted-foreground text-sm'>{formatDate(taskData.createdAt)}</p>
                    </div>
                </div>
                <div className="flex flex-col gap-2 mt-2 w-[50%]"> 
                    <p className="text-muted-foreground text-sm font-semibold mt-2">Last Updated</p>
                    <div className="flex items-center ">
                        <p className='text-muted-foreground text-sm'>{formatDate(taskData.updatedAt)}</p>
                    </div>
                </div>
                
                
            </div>
            <div className="flex items-center mt-2 flex-row-reverse justify-between"> 
                <div className='flex gap-2'>
                    <button className='btn btn-sm text-black bg-gray-200 hover:bg-gray-100 transition-all ease-in-out border-0' onClick={() => onEdit()}>
                        <Pencil className='mr-2 h-4 w-4' />
                        Edit
                    </button>
                    <button className='btn btn-sm text-black bg-red-500 hover:bg-red-300 transition-all ease-in-out border-0' onClick={() => setDeleteModal(true)}>
                        <Trash className='mr-2 h-4 w-4' />
                        Delete
                    </button>
                </div>
                <p className='text-muted-foreground text-sm'><span className='font-semibold'>ID:</span> {taskData._id}</p>
            </div>
        </div>
        {/**Delete Modal*/}
        {showDeleteModal && <DeleteConfirmationModal onCancel={() => setDeleteModal(false)} /> }
    </div>
  )
}

export default TaskViewerModal