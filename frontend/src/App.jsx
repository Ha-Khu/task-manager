import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './pages/Login'
import Tasks from './pages/Tasks'

function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/Tasks' element={<Tasks />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App