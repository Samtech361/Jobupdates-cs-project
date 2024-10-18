const express = require('express')
require('dotenv').config();
require('./dB/mongodb.connection')
const cors = require('cors');
const authRoutes = require('./Routes/auth.Routes')
const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(express.json())

app.use('/api', authRoutes)



port = 5500


app.listen(port, () => {
    console.log(`server listening on http://localhost:${port}`)
})