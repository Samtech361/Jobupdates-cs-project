import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className=' flex justify-center'>
        <Link to='/dashoard'>Home</Link>
        <Link to='/'>Sign In</Link>
        <Link to='/register'>Sign Up</Link>
    </nav>
  )
}
