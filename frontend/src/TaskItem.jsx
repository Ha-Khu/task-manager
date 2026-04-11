function TaskItem({text, done, onDelete, onToggle}){
return (
    <div className="flex items-center justify-between bg-gray-800 rounded-lg p-4">
      <p
        onClick={onToggle}
        className={`cursor-pointer text-white cursor-pointer ${done ? "line-through text-gray-500" : ""}`}
      >
        {text}
      </p>
      <button 
        onClick={onDelete}
        className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 transition text-sm cursor-pointer"
      >
        Zmazať
      </button>
    </div>
  )
}

export default TaskItem