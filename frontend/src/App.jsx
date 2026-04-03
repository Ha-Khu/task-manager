import {useState, useEffect} from 'react'
import axios from 'axios'
import TaskItem from './TaskItem'


function App() {
  const [tasks, setTasks] = useState([])
  const [inputValue, setInputValue] = useState("")

  function addTask() {
    if(inputValue === "") return
    axios.post("http://localhost:3000/tasks", {text: inputValue, done: false})
    .then(function(response){
      axios.get("http://localhost:3000/tasks").then(function(response){
        setTasks(response.data)
      })
      setInputValue("")
    })
  }

  function deleteTask(index){
    const newTasks = tasks.filter((_, i) => index !== i)
    setTasks(newTasks)
  }

  function toggleTask(index){
    setTasks(tasks.map((task, i) =>{
      if(i === index){
        return {...task, done: !task.done}
      } else {
        return task
      }
    }))
  }

  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() =>{
    axios.get("http://localhost:3000/tasks").then(function(response){
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
        onDelete={() => deleteTask(index)} 
        onToggle={() => toggleTask(index)}
        />
      ))}
    </div>
  )
}

export default App
