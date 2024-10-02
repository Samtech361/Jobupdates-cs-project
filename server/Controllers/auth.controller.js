module.exports.login_user = (req, res) => {
  const { email, password } = req.body

  const user = [{
    "email" : "test@gmail.com",
    "password" : 1234
  }]
  try {
    if( email !== user.email && password !== user.password){
        console.log('user details correct');
        
    }
  } catch (error) {
    console.log('invalid email or password')
  }
}