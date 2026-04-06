import {useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Login(){
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  function handleLogin(){
    axios.post("http://localhost:3000/login", {email, password}).
    then(function(response){
      localStorage.setItem('token', response.data.token)
      navigate('/tasks')
    })
  }
  return (
    <div>
      <h1>Login</h1>

      <input 
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="email" />
      <input 
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)} 
      placeholder="password" />
      <button onClick={handleLogin}>Poslať</button>
    </div>
  )
}

export default Login