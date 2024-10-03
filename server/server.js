const express = require('express')
require('dotenv').config();
require('./dB/mongodb.connection')
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { login_user, registerUser } = require('./Controllers/auth.controller');

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(express.json())

app.post('/login', login_user) 
app.post('/register', registerUser)
    

port = 5500


app.listen(port, ()=> {
    console.log(`server listening on http://localhost:${port}`)
})