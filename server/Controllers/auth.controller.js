const User = require('../models/users.models')

module.exports.login_user = async(req, res) => {
    try {
        const {email, password} = req.body
        
        const user = await User.findOne({email: email})

        if(!user) {
            return res.status(400).send({message:'User Not Found'})
        }
        
        const ismatch = password === user.password       
        if(!ismatch) {
            return res.status(400).send({message: 'Invalid Email or Password'})
        }

        res.send({
            username: user.username,
            id: user._id,
            message: 'Login successful'
        })

        
    } catch (error) {
        res.send(error.message)
    }
}

module.exports.registerUser = async(req, res) =>{
    try {
        const {username, email, password} = req.body
    
        const existingUser = await User.findOne({email: email})
        if(existingUser) throw new Error('User already exists')
        
        const user = new User({username, email, password})

        user.save();

        console.log(user)
    } catch (error) {
        console.log(error.message)
    }
    
    
}