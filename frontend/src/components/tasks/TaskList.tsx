import { Task } from '../../types/tasks'
import TaskListItem from './TaskListItem'

interface TaskListItemProps {
    taskArray: Task[]
}

const TaskList = ( {taskArray}: TaskListItemProps) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {/**Task List Items */}
        {taskArray.map((taskData) => (
            <div key={taskData._id} className=' grid grid-cols-1 h-[250px]'>
                <TaskListItem key={taskData._id} taskData={taskData} />
            </div>))}
    </div>
  )
}

export default TaskList