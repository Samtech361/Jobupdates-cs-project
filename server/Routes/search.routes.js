const express = require('express')
const jobs = require('../MOCK_DATA.json')
const {searchJobs, getJobById, getJobRecommendations} = require('../Controllers/search.controller')
const auth = require('../config/auth');
const router = express.Router();

router.post('/jobsearch', searchJobs )
// router.get('/jobs/${id}', getJobById)
router.get('/jobs/:id', auth ,getJobById);
router.get('/jobs/:id/recommendations', auth, getJobRecommendations);

module.exports = router;