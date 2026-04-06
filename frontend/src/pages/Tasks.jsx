import {useState, useEffect} from 'react'
import axios from 'axios'
import TaskItem from '../TaskItem'


function App() {
  const [tasks, setTasks] = useState([])
  const [inputValue, setInputValue] = useState("")

  function addTask() {
    const token = localStorage.getItem('token')
    if(inputValue === "") return
    axios.post("http://localhost:3000/tasks", {text: inputValue, done: false}, {
      headers: {authorization: token}
    })
    .then(function(response){
      axios.get("http://localhost:3000/tasks", {
        headers: {authorization: token}
      }).then(function(response){
        setTasks(response.data)
      })
      setInputValue("")
    })
  }

  function deleteTask(id){
    const token = localStorage.getItem('token')
    axios.delete(`http://localhost:3000/tasks/${id}`, {
      headers: {authorization: token}
    }).
    then(function(response){
      axios.get("http://localhost:3000/tasks", {
        headers: {authorization: token}
      }).then(function(response){
        setTasks(response.data)
      })
    })
  }

  function toggleTask(id, done){
    const token = localStorage.getItem('token')
    axios.put(`http://localhost:3000/tasks/${id}`, {done: !done}, {
      headers: {authorization: token}
    }).
    then(function(response) {
      axios.get("http://localhost:3000/tasks", {
        headers: {authorization: token}
      }).then(function(response) {
        setTasks(response.data)
      })
    })
  }

  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() =>{
    const token = localStorage.getItem('token')
    axios.get("http://localhost:3000/tasks", {
      headers: {authorization: token}
    }).then(function(response){
      setTasks(response.data)
      setIsLoaded(true)
    })
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
