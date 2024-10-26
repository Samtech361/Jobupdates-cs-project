const express = require('express')
const jobs = require('../MOCK_DATA.json')
const {searchJobs, getJobById} = require('../Controllers/search.controller')
const router = express.Router();

router.post('/jobsearch', searchJobs )
// router.get('/jobs/${id}', getJobById)
router.get('/jobs/:id', getJobById);

module.exports = router;