import { CalendarIcon, Clock } from 'lucide-react'
import { Task } from '../../types/tasks'
import { formatDate, formatDateTime } from '../../utils/dateTimeFormatter'
import { useTaskStore } from '../../store/useTaskStore'

interface TaskListItemProps {
    taskData: Task
}
const TaskListItem = ( { taskData }: TaskListItemProps) => {

  const {setSelectedTask} = useTaskStore();

  return (
    <div className='p-4 border border-gray-200 rounded-md flex flex-col justify-between w-full'>
            <div className='flex justify-between w-full'>
                <h1 className='text-lg font-semibold w-[75%]'>{taskData.title}</h1>
                <div className='w-[25%] flex justify-end'><TaskBadge taskStatus={taskData.taskStatus}  /> </div>
            </div>
            <p className='text-muted-foreground text-sm mt-2'>{taskData.description}</p>
            <div className='flex items-center mt-2'> 
                <CalendarIcon className='mr-2 h-4 w-4' />
                <p className='text-muted-foreground text-sm'>{formatDate(taskData.dueDate)}</p>
            </div>
            <div className='flex items-center mt-2'> 
                <Clock className='mr-2 h-4 w-4' />
                <p className='text-muted-foreground text-sm'>{formatDateTime(taskData.dueDate)}</p>
            </div>
        {/**View Button */}
        <div className='flex items-center mt-2 flex-row-reverse justify-between'> 
            <button className='btn text-black bg-white hover:bg-gray-100 transition-all ease-in-outborder border-gray-200' onClick={() => setSelectedTask(taskData)}>View</button>
            <p className='text-muted-foreground text-sm'><span className='font-semibold'>ID:</span> {taskData._id}</p>
        </div>
    </div>
  )
}

export default TaskListItem

interface TaskBadgeProps {
    taskStatus: string
}

export const TaskBadge = ( { taskStatus }: TaskBadgeProps) => {
  return (
    <div className={taskStatus === "Complete" ? "badge badge-success" : taskStatus === "To Do" ? "badge badge-info" : "badge badge-warning" }>
        {taskStatus}
    </div>
  )
}

