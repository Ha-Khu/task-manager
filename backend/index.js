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

function verifyToken(req, res, next){
  const token = req.headers.authorization
  if(!token){
    res.status(401).json({error: "Neplatný token"})
    return
  } else {
    try{
      const tokenApproved = jwt.verify(token, SECRET)
      req.user = tokenApproved
      next()
    } catch(err){
      res.status(401).json({error: "Neplatný token"})
    }
  }
}


app.get('/tasks', verifyToken, (req, res)=> {
  const userID = req.user.id
  let sql = "SELECT * FROM tasks WHERE user_id = ?"
  db.query(sql, [userID], (err, results) =>{
    if(err) {
      res.status(500).json({error: err.message})
      return
    }
    res.json(results)
  })
})

/* POST/TASKS */
app.post('/tasks', verifyToken, (req, res) => {
  const userID = req.user.id
  const data = req.body
  let sql = "INSERT INTO tasks (text, done, user_id) VALUES(?, ?, ?)"
  db.query(sql, [data.text, data.done, userID], (err, results) =>{
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

app.delete('/tasks/:id', verifyToken, (req, res) =>{
  const userID = req.user.id
  const id = Number(req.params.id) 
  let sql = "DELETE FROM tasks WHERE id = ? AND user_id = ?"
  db.query(sql, [id, userID], (err, results) => {
    if(err){
      res.status(500).json({error: err.message})
      return
    }
    res.json(results)
  })
})

app.put('/tasks/:id', verifyToken, (req, res)=> {
  const userID = req.user.id
  const id =  Number(req.params.id)
  const data = req.body
  let sql = "UPDATE tasks SET done = ? WHERE id = ? AND user_id = ?"
  db.query(sql, [data.done, id, userID], (err, results) => {
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