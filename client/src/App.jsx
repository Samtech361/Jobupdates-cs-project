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
import { AuthProvider } from './utils/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Navbar />
          <Routes>
            <Route path='/' element={<Dashboard/>} />
            <Route element={<PrivateRoute/>}>
              <Route path='/profile' element={<UserProfile/>}/>
            </Route>
            <Route path='/register' element={<Register/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/upload' element={<Upload/>} />
            <Route path="/job/:id" element={<JobDetailPage />} />
          </Routes>
      
    </AuthProvider>
  )
}

export default App
