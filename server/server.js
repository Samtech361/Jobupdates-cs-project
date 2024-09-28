const express = require('express')
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

app.use(cors())

app.use(express.json())

app.post('/login', (req, res) => {
    const {email, password} = req.body;

    if(email !== 'test@gmail.com' && password !== '123'){
        console.log('user invalid')
    }

    const payload = { _id:1, email}

    const secret_key = "ieutenfdknfdknckckvssd";

    const token = jwt.sign(payload, secret_key )
    
    res.send({
        'message': 'Login Successful',
        token: token
    })
})

port = 5500


app.listen(port, ()=> {
    console.log(`server listening on http://localhost:${port}`)
})