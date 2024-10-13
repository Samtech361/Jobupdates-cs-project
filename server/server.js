const express = require('express')
require('dotenv').config();
require('./dB/mongodb.connection')
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { login_user, registerUser } = require('./Controllers/auth.controller');
const jobdata = require('./MOCK_DATA.json')


const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(express.json())

app.post('/login', login_user)
app.post('/register', registerUser)
app.post('/jobsearch', (req, res) => {
    const data = req.body.query

    res.json(
        // [
        //     {
        //         'title': "Product Designer",
        //         "company": "Upscale Hiring",
        //         "location": "Marina East, Singapore",
        //         "description": "Within this role you will be creating content for a wide range of local and international clients. This role is suited to Bali based creatives looking to work in-house.",
        //         "salary": "$8000-$12000",
        //         "postedTime": "5 mins ago",
        //         "type": "Part-time",
        //         "locationType": "On-site"
        //     },
        //     {
        //         'title': "Software Engineering",
        //         "company": "Upscale Hiring",
        //         "location": "Marina East, Singapore",
        //         "description": "Within this role you will be creating content for a wide range of local and international clients. This role is suited to Bali based creatives looking to work in-house.",
        //         "salary": "$8000-$12000",
        //         "type": 'Full-time',
        //         "postedTime": "5 mins ago",
        //         "location-type": "Remote"
        //     },
        //     {
        //         'title': "Backend Developer",
        //         "company": "Upscale Hiring",
        //         "location": "Marina East, Singapore",
        //         "description": "Within this role you will be creating content for a wide range of local and international clients. This role is suited to Bali based creatives looking to work in-house.",
        //         "salary": "$8000-$12000",
        //         "postedTime": "5 mins ago",
        //         "type": "Internship",
        //         "locationType": "On-site"
        //     }
        // ]
        jobdata
        )
})


port = 5500


app.listen(port, () => {
    console.log(`server listening on http://localhost:${port}`)
})