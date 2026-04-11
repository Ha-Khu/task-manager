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
    }).catch(function(err){
      setError(err.response.data.error)
    })
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-white text-3xl font-bold mb-6 text-center">LOGIN</h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg p-3 mb-4 outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Heslo"
          className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg p-3 mb-4 outline-none focus:ring-2 focus:ring-purple-500"
        />
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <button
          onClick={handleLogin}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg p-3 mb-3 transition cursor-pointer"
        >
          Prihlásiť sa
        </button>
        <button
          onClick={handleRegister}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg p-3 transition cursor-pointer"
        >
          Registrovať sa
        </button>
      </div>
    </div>
  )
}

export default Login