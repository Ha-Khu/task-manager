const express = require('express')
const mysql = require('mysql2')
const app = express()
const port = 3000
const bcrypt = require('bcrypt')

const cors = require('cors')
app.use(cors())

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
  let sql = "INSERT INTO tasks (text, done) VALUES(?, ?)"
  db.query(sql, [data.text, data.done], (err, results) =>{
    if(err){
      res.status(500).json({error: err.message})
      return
    }
    res.json(results)
  })
})

/* LOGIN */

app.post('/register', (req, res) => {
  const data = req.body
  let sql = "INSERT INTO users (email, password) VALUES(?, ?)"
  bcrypt.hash(data.password, 10).then((hashPassword)=>{
    db.query(sql, [data.email, hashPassword], (err, results) =>{
    if(err) {
      res.status(500).json({error: err.message})
      return
    }
    res.json(results)
    })
  })
})

app.delete('/tasks/:id', (req, res) =>{
  const id = Number(req.params.id) 
  let sql = "DELETE FROM tasks WHERE id = ?"
  db.query(sql, [id], (err, results) => {
    if(err){
      res.status(500).json({error: err.message})
      return
    }
    res.json(results)
  })
})

app.put('/tasks/:id', (req, res)=> {
  const id =  Number(req.params.id)
  const data = req.body
  let sql = "UPDATE tasks SET done = ? WHERE id = ?"
  db.query(sql, [data.done, id], (err, results) => {
    if(err) {
      res.status(500).json({error: err.message})
      return
    }
    res.json(results)
  })
})

app.listen(port, () =>{
  console.log(`Example app listening on port ${port}`)
})