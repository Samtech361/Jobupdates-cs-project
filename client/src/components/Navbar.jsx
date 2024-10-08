import React from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <>
       {/* <nav className=' flex justify-center'>
        <Link to='/dashboard'>Home</Link>
        <Link to='/'>Sign In</Link>
        <Link to='/register'>Sign Up</Link>
        <Link to='/profile'>Profile</Link>
    </nav>  */}

    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-green-600 font-bold text-2xl">JobUpdates</Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink to="/dashboard">Find Jobs</NavLink>
              <NavLink to="/talent">Find Talent</NavLink>
              <NavLink to="/upload">Upload Job</NavLink>
              <NavLink to="/about">About Us</NavLink>
            </div>
          </div>
          <div className="flex items-center">
            <button className="p-2 rounded-full text-gray-400 hover:text-green-600 focus:outline-none">
              
            </button>
            <div className="ml-3 relative">
              <div>
                <button className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-green-300 overflow-hidden" id="user-menu" aria-haspopup="true">
                  <NavLink to='/profile'>
                  <img className="h-8 w-8 rounded-full" alt="User profile" />
                  </NavLink>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
    </>
    
  )
}
