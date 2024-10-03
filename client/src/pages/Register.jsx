import axios from 'axios'
import React, { useState } from 'react'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const registerUser =async(e) => {
    e.preventDefault()

  //  const response = await fetch('http://localhost:5500/register', {
  //   method: 'POST',
  //   headers: {'Content-type' :  'application/json'},
  //   body: JSON.stringify({username, email, password})
  //  })
    console.log('Submited', {username, email})

   setUsername('')
   setEmail('')
   setPassword('')
   console.log(``)
  }

  const test = (e) => {

  }
  return (
    <main>
      <div className='flex flex-col w-96' onSubmit={registerUser}>
        <h1>Sign Up</h1>
        <form action="" className='flex flex-col'>
          <input type="text" placeholder='username' required value={username} onChange={(e)=>{
            setUsername(e.target.value)
          }}
          
          />
          <input type="email" placeholder='email' required value={email} onChange={(e)=>{
            setEmail(e.target.value)
          }}/>
          <input type="password" placeholder='password' required value={password} onChange={(e)=>{
            setPassword(e.target.value)
          }}/>

          <button type='submit'>Sign Up</button>
        </form>
      </div>
    </main>
  )
}
