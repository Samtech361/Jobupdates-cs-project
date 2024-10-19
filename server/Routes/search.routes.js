const express = require('express')
const jobs = require('../MOCK_DATA.json')

const router = express.Router();

router.post('/jobsearch', (req,res)=>{

    
    res.send(jobs)
})

module.exports = router;