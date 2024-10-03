
import { useState } from 'react'
import { Navigate, useNavigate} from 'react-router-dom'
import axios from '../components/axios'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate =useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/login',
                {email, password},
                {
                    header: {"Content-Type" : "application/json"},
                    withCredentials: true
                }
            )

            if(response.data.success){
                console.log('user verified')
            }
                
            setEmail('');
            setPassword('')
        } catch (error) {
            console.log({
                'error': error
            });
            
        }

    //    .then(response =>{
    //     if(!response.ok){
    //         throw new Error('error')
    //     }
    //     return response.json();
    //    })

    //    .then(data => {
    //     localStorage.setItem('token', data.token)

    //     // console.log(localStorage.getItem('token'))
    //     })
    //     alert('login successful')
    //     navigate('/dashboard')
    }
    return (
        <div className="h-screen flex justify-center items-center">
            <div className="h-auto w-80 flex flex-col items-center bg-slate-50 p-8 rounded-3xl">
                <h1 className="mb-4">Sign In</h1>
                <p>Enter your details to sign in</p>
                <form onSubmit={handleSubmit} className="flex flex-col mb-8">
                    <input type="email" placeholder="Email" id='email' value={email} onChange={ e => {setEmail(e.target.value)}} className="mb-6 rounded-md p-1"/>
                    <input type="password" placeholder="Password" id='password' value={password} onChange={e => {setPassword(e.target.value)}} className="mb-8 p-1"/>
                    <button className="mb-8">Google</button>
                    <button type="submit" className=" w-full bg-green-300 cursor-pointer">Sign In</button>
                </form>
            </div>

        </div>
    )
}
