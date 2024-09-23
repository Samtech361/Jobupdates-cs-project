import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className=' flex justify-center'>
        <Link to='/'>Home</Link>
        <Link to='/login'>Sign In</Link>
        <Link to='/register'>Sign Up</Link>
    </nav>
  )
}
