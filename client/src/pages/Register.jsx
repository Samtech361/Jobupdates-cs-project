import axios from '../components/axios'
import React, { useState } from 'react'


export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const registerUser =async(e) => {
    e.preventDefault()

    try {
      const response = await axios.post('/register',
        {username, email, password},
        {
          withCredentials:true,
          headers: {"Content-Type":"application/json"}
        }
      )

      data = response.data;

      console.log(data)
      
    } catch (error) {
      
    }
    
    setPassword('')
    setUsername('')
    setEmail('')
  }

  return (
    <main>
      <div className='flex flex-col w-96' onSubmit={registerUser}>
        <h1>Sign Up</h1>
        <br />
        <form action="" className='flex flex-col ml-2'>
          <input type="text" placeholder='username' required value={username} onChange={(e)=>{
            setUsername(e.target.value)
          }}
          
          />
          <br />
          <input type="email" placeholder='email' required value={email} onChange={(e)=>{
            setEmail(e.target.value)
          }}/>
          <br />
          <input type="password" placeholder='password' required value={password} onChange={(e)=>{
            setPassword(e.target.value)
          }}/>
          <br />
          <button type='submit'>Sign Up</button>
        </form>
      </div>
    </main>
  )
}
