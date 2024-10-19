const express = require('express')
require('dotenv').config();
require('./config/mongodb.connection')
const cors = require('cors');
const authRoutes = require('./Routes/auth.Routes')
const resumeRoutes = require('./Routes/resume.routes')
const searchRoutes = require('./Routes/search.routes')

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(express.json())

app.use('/api', authRoutes)
app.use('/api', resumeRoutes);
app.use('/api', searchRoutes)



port = 5500


app.listen(port, () => {
    console.log(`server listening on http://localhost:${port}`)
})