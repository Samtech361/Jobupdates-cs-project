

export default function Login() {
    const testUser = (e) => {
        e.preventDefault()
        const user = [
            {
                'email': 'test@gmail.com',
                'password': 123456
            }
        ]


    }
    return (
        <div className="h-screen bg-red-100 flex justify-center items-center">
            <div className="h-auto w-80 flex flex-col items-center bg-slate-50 p-8 rounded-3xl">
                <h1 className="mb-4">Sign In</h1>
                <p>Enter your details to sign in</p>
                <form onSubmit={testUser} className="flex flex-col mb-8">
                    <input type="email" placeholder="Enter email" onSubmit={() => {

                    }} className="mb-6 rounded-md p-1"/>
                    <input type="password" placeholder="Enter password" className="mb-8 p-1"/>
                    <button className="mb-8">Google</button>
                    <button type="submit" className=" w-full bg-green-300 cursor-pointer">Sign In</button>
                </form>
            </div>

        </div>
    )
}
