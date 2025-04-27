import { useState,useEffect } from "react";

import { CirclePlus } from "lucide-react"
import Header from "./components/layout/Header.tsx"
import TaskFormModal from "./components/tasks/TaskFormModal.tsx";
import { Toaster } from "react-hot-toast";
import { useTaskStore } from "./store/useTaskStore.ts";
import TaskList from "./components/tasks/TaskList.tsx";
import TaskViewerModal from "./components/tasks/TaskViewerModal.tsx";
import FilterTab from "./components/layout/FilterTab.tsx";
import { selectFilteredTasks } from "./store/useTaskStore.ts";

function App() {
  const [openFormModal, setOpenFormModal] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  const { tasks, selectedTask, setSelectedTask, getAllTasks, getTask,  pageCount, activeFilter} = useTaskStore();


  useEffect(() => {
    getAllTasks(page, limit);
  }, [getAllTasks, page, limit]);

  const handleSubmitSearch = () => {
    getTask(searchInput);
  }

  return (
    <>
      <Header />
      <div className="container mx-auto py-6 space-y-6 p-4">
      <div className="items-center justify-between flex
      ">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Task Dashboard</h1>
          <p className="text-muted-foreground">Manage and track all your casework tasks in one place</p>
        </div>
          <input type="search" placeholder="Fetch a specific task by ID" className="input input-bordered input-md w-full max-w-xs mx-2"  value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={ (e) => e.key === 'Enter' && handleSubmitSearch()}/>
          <button className="flex items-center btn btn-soft" onClick={() => {setOpenFormModal(true)}}>
            <CirclePlus className="mr-2 h-4 w-4" />
            Create Task
          </button>
      </div>
      {/* Task Filter  */}
      <div>
        <FilterTab />
      </div>
      {/* Task List  */}
      {(tasks.length <= 0) && <h1 className="text-3xl font-bold tracking-tight">No Tasks Found</h1>}
      <TaskList taskArray={selectFilteredTasks({tasks, activeFilter})} />
    <div className="flex items-center justify-between">
       <button className={`justify-start btn btn-sm text-black bg-gray-200 hover:bg-gray-100 transition-all ease-in-out border-0 mr-2 ${page === 1 && "opacity-50 cursor-not-allowed"} ` } onClick={() => {
        if(page > 1) setPage(page - 1)}}>Prev</button>
      <span className="text-muted-foreground text-sm">Viewing {page} of {pageCount}</span>

      <button className={`justify-end btn btn-sm text-black bg-gray-200 hover:bg-gray-100 transition-all ease-in-out border-0 mr-2 ${page === pageCount && "opacity-50 cursor-not-allowed"}`} onClick={() => {
        if(page < pageCount) setPage(page + 1)}}>Next</button>
    </div>
    </div>
    
    {/* Task Form Modal */}
    {openFormModal && <TaskFormModal onCancel={() => setOpenFormModal(false)} />}

    {/* Task Viewer Modal */}
    {selectedTask && <TaskViewerModal taskData={selectedTask} onCancel={() => setSelectedTask(null)} onEdit={() => setOpenFormModal(true) }/>}

    {/* Toaster */}
    <Toaster position="bottom-center" />
    </>
  )
}

export default App