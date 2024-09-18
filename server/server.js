const express = require('express')

const app = express();

app.get('/', (req, res) => {
    res.send('Welcome to root page')
})


app.listen(3000, ()=> {
    console.log('server listening on http://localhost:3000')
})