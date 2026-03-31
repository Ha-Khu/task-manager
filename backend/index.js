const express = require('express')
const app = express()
const port = 3000

const tasks = [
  {id: 1, text: "Nakúpiť potraviny", done: false},
  {id: 2, text: "Spraviť domácu úlohu", done: false}
]

app.get('/tasks', (req, res)=> {
  res.json(tasks)
})

app.use(express.json())

app.post('/tasks', (req, res) => {
  const data = req.body
  tasks.push(data)
  res.json(tasks)
})

app.listen(port, () =>{
  console.log(`Example app listening on port ${port}`)
})