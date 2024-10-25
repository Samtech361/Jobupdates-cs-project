const express = require('express')
const jobs = require('../MOCK_DATA.json')
const searchJobs = require('../Controllers/search.controller')
const router = express.Router();

router.post('/jobsearch', searchJobs )

module.exports = router;