const express = require('express')
require('dotenv').config();
require('./config/mongodb.connection')
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./Routes/auth.Routes')
const resumeRoutes = require('./Routes/resume.routes')
const searchRoutes = require('./Routes/search.routes')
const userRoutes = require('./Routes/user.routes')

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(express.json())
app.use(cookieParser());

app.use('/api', authRoutes)
app.use('/api', resumeRoutes);
app.use('/api', searchRoutes)
app.use('/api', userRoutes)




port = 5500


app.listen(port, () => {
    console.log(`server listening on http://localhost:${port}`)
})