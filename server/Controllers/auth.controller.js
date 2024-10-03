module.exports.login_user = (req, res) => {
    const { email, password } = req.body
    console.log(email)

    res.send({
        'message': 'data received successfully',
        success: false
    })
  const user = [{
    "email" : "test@gmail.com",
    "password" : 1234
  }]
 
    if( email !== user.email && password !== user.password){
        console.log('user details correct');
        
    }else{
        return Error('invalid email or password')
    }
 
}

module.exports.registerUser = (req, res) =>{
    const {username, email, password} = req.body
    const user = [username, email, password]

    console.log(user)
}