import {useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Login(){
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const [error, setError] = useState("")

  function handleLogin(){
    axios.post("http://localhost:3000/login", {email, password}).
    then(function(response){
      localStorage.setItem('token', response.data.token)
      navigate('/tasks')
    }).catch(function(err){
      setError(err.response.data.error)
    })
  }

  function handleRegister(){
    axios.post("http://localhost:3000/register", {email, password}).
    then(function(response){
      handleLogin()
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
      <button onClick={handleLogin}>Prihlásiť sa</button>
      <button onClick={handleRegister}>Registrovať sa</button>
      {error && <p>{error}</p>}
    </div>
  )
}

export default Login