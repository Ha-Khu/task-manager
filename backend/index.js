const express = require('express')
const mysql = require('mysql2')
const app = express()
const port = 3000

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'task_manager'
})

db.connect((err) =>{
  if (err) {
    console.log("Chyba pripojenia", err)
    return
  }
  console.log("Pripojený k databáze!")
})

let tasks = [
  {id: 1, text: "Nakúpiť potraviny", done: false},
  {id: 2, text: "Spraviť domácu úlohu", done: false}
]

app.get('/tasks', (req, res)=> {
  db.query('SELECT * FROM tasks', (err, results) =>{
    if(err) {
      res.status(500).json({error: err.message})
      return
    }
    res.json(results)
  })
})

app.use(express.json())

app.post('/tasks', (req, res) => {
  const data = req.body
  tasks.push(data)
  res.json(tasks)
})

app.delete('/tasks/:id', (req, res) =>{
  const deleteingTask = Number(req.params.id) 
  tasks = tasks.filter((task) => task.id !== deleteingTask)
  res.json(tasks)
})

app.listen(port, () =>{
  console.log(`Example app listening on port ${port}`)
})