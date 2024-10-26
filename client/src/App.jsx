import './App.css'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import PrivateRoute from './utils/PrivateRoute'
import UserProfile from './pages/userProfile'
import Upload from './pages/Upload'
import JobDetailPage from "./components/JobDetailPage"

function App() {
  return (
    <>
      <Navbar />
          <Routes>
            <Route path='/dashboard' element={<Dashboard/>} />
            <Route element={<PrivateRoute/>}>
              <Route path='/profile' element={<UserProfile/>}/>
            </Route>
            <Route path='/register' element={<Register/>}/>
            <Route path='/' element={<Login/>}/>
            <Route path='/upload' element={<Upload/>} />
            <Route path="/job/:id" element={<JobDetailPage />} />
          </Routes>
      
    </>
  )
}

export default App
