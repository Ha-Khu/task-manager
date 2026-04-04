import {useState} from 'react'
function Login(){
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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
      <button>Poslať</button>
    </div>
  )
}

export default Login