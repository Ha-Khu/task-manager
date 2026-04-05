const express = require('express')
const mysql = require('mysql2')
const app = express()
const port = 3000
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const cors = require('cors')
app.use(cors())
app.use(express.json())
const SECRET = "tajny_kluc_123"

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


app.get('/tasks', (req, res)=> {
  db.query('SELECT * FROM tasks', (err, results) =>{
    if(err) {
      res.status(500).json({error: err.message})
      return
    }
    res.json(results)
  })
})

/* POST/TASKS */
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

/* POST/REGISTER */

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

/* POST/LOGIN */

app.post('/login', (req, res) => {
  const data = req.body
  let sql = "SELECT * FROM users WHERE email = ?"
  db.query(sql, [data.email], (err, results) => {
    if(err){
      res.status(500).json({error: err.message})
      return
    }
    if(results.length === 0) {
      res.status(401).json({error: "Email neexistuje"})
      return
    }
    bcrypt.compare(data.password, results[0].password).then((match)=>{
      if(match){
        const token = jwt.sign({id: results[0].id, email: results[0].email}, SECRET)
        res.json({token})
      } else {
        res.status(401).json({error: "Nesprávne heslo"})
      }
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