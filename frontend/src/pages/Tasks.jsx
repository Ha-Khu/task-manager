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

  return(
    <div>
      <h1>Task Manager</h1>
      <input 
      type="text" 
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      placeholder='Nový task...'
      />
      <button onClick={addTask}>Pridať</button>
      <button onClick={handleLogout}>Odhlásiť sa</button>
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
  )
}

export default App
