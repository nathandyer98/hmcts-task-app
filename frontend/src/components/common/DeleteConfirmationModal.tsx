import { useTaskStore } from "../../store/useTaskStore";

interface DeleteConfirmationModalProps {
    onCancel: () => void
}

const DeleteConfirmationModal = ( { onCancel }: DeleteConfirmationModalProps) => {

    const { deleteTask, selectedTask } = useTaskStore();
    
  return (
    <div className="absolute w-full h-full flex items-center justify-center bg-black/80">
        <div className="w-full max-w-lg p-6 rounded-lg shadow-lg bg-white text-black">
            <h1 className="text-xl font-semibold mb-4">Are you sure you want to delete this task?</h1>
            <div className="flex justify-end">
                <button className="btn btn-sm text-black bg-gray-200 hover:bg-gray-100 transition-all ease-in-out border-0 mr-2" onClick={() => onCancel()}>Cancel</button>
                <button className="btn btn-sm text-black bg-red-500 hover:bg-red-300 transition-all ease-in-out border-0" onClick={() => deleteTask( selectedTask!._id)}>Delete</button>
            </div>
        </div>
    </div>
  )
}

export default DeleteConfirmationModal