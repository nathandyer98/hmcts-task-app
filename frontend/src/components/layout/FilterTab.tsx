import { useTaskStore } from '../../store/useTaskStore';
import { TaskStatusTypes } from '../../enum/TaskStatusTypes';

const filterOptions = [
    { id: 'All', name: 'All' },
    { id: 'ToDo', name: 'To Do' },
    { id: 'InProgress', name: 'In Progress' },
    { id: 'Complete', name: 'Complete' },
];


const FilterTab = () => {
    const {taskCounts, setFilter, activeFilter} = useTaskStore();

    const handleSelectFilter = (filter: TaskStatusTypes | "All") => {
        setFilter(filter);
    }

    const getCountForFilter = (filter: TaskStatusTypes | "All") => {
        return taskCounts[filter];
    }

    return (
        <div className="w-full border flex justify-evenly rounded-md">
            {filterOptions.map(option => (
                <button
                    key={option.id}
                    className={`btn w-1/4 ${activeFilter === option.id ? 'btn-primary' : ''}`}
                    onClick={() => handleSelectFilter(option.id as TaskStatusTypes | "All")}
                >
                    {option.name} ({getCountForFilter(option.id as TaskStatusTypes | "All")})
                </button>
            ))}
        </div>
    );
}

export default FilterTab