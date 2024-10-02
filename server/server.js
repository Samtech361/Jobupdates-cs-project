const express = require('express')
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { login_user } = require('./Controllers/auth.controller');

const app = express();

app.use(cors())

app.use(express.json())

app.post('/login', login_user) 
    

port = 5500


app.listen(port, ()=> {
    console.log(`server listening on http://localhost:${port}`)
})