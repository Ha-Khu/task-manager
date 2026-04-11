import {useState, useEffect} from 'react'
import axios from 'axios'
import TaskItem from '../TaskItem'
import { useNavigate } from 'react-router-dom'


function App() {
  const [tasks, setTasks] = useState([])
  const [inputValue, setInputValue] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  
  useEffect(() =>{
    if(!token) navigate("/")
  }, [])

  function fetchTasks(){
    axios.get("http://localhost:3000/tasks", {
      headers: {authorization: token}
    }).then(function(response){
      setTasks(response.data)
    })
  }

  function addTask() {
    if(inputValue === "") return
    axios.post("http://localhost:3000/tasks", {text: inputValue, done: false}, {
      headers: {authorization: token}
    })
    .then(function(response){
      fetchTasks()
      setInputValue("")
    })
  }

  function deleteTask(id){
    axios.delete(`http://localhost:3000/tasks/${id}`, {
      headers: {authorization: token}
    }).
    then(function(response){
      fetchTasks()
    })
  }

  function toggleTask(id, done){
    axios.put(`http://localhost:3000/tasks/${id}`, {done: !done}, {
      headers: {authorization: token}
    }).
    then(function(response) {
      fetchTasks()
    })
  }

  function handleLogout(){
    localStorage.removeItem('token')
    localStorage.removeItem('tasks')
    navigate("/")
  }

  useEffect(() =>{
    fetchTasks()
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (!isLoaded) return
    console.log("ukladám tasky: ", tasks)
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks, isLoaded])

return (
  <div className="min-h-screen bg-gray-900 p-8">
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-white text-3xl font-bold">Task Manager</h1>
        <button 
          onClick={handleLogout}
          className="bg-gray-700 hover:bg-gray-600 text-white rounded-lg px-4 py-2 transition cursor-pointer"
        >
          Odhlásiť sa
        </button>
      </div>

      <div className="flex gap-3 mb-8">
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder='Nový task...'
          className="flex-1 bg-gray-800 text-white placeholder-gray-400 rounded-lg p-3 outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button 
          onClick={addTask}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg px-6 transition cursor-pointer"
        >
          Pridať
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {tasks.map((task, index) =>(
          <TaskItem 
            key={index} 
            text={task.text}
            done={task.done} 
            onDelete={() => deleteTask(task.id)} 
            onToggle={() => toggleTask(task.id, task.done)}
          />
        ))}
      </div>
    </div>
  </div>
)
}

export default App
