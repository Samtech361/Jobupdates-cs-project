// // matchingController.js
// const JobMatchingService = require('../services/matchingService');
// const User = require('../models/User'); // Adjust path as needed

// // Modify getJobById to include resume matching
// const getJobByIdWithMatching = async (req, res) => {
//   const { id } = req.params;
//   const searchQuery = req.query.searchQuery || "software developer";
//   const apiKey = process.env.APIKEY;

//   try {
//     // First get user's resume
//     const user = await User.findById(req.user.id);
//     if (!user?.resumeText) {
//       return res.status(404).json({ 
//         error: 'Resume not found',
//         message: 'Please upload your resume first to see match score'
//       });
//     }

//     // Fetch jobs using the search query from SerpAPI
//     const response = await axios.get(
//       `https://serpapi.com/search.json?q=${encodeURIComponent(
//         searchQuery
//       )}&engine=google_jobs&location=United+States&hl=en&api_key=${apiKey}`
//     );

//     // Check if jobs_results exists in the response
//     if (!response.data.jobs_results) {
//       return res.status(404).json({ 
//         error: 'No jobs found',
//         message: 'No jobs found for the given search query'
//       });
//     }

//     // Transform the jobs data and find the specific job
//     const jobs = response.data.jobs_results.map((job) => {
//       const extensions = job.detected_extensions || {};
//       const cleanDescription = job.description
//         ? job.description.replace(/\s+/g, ' ').trim()
//         : '';

//       const idSource = `${job.title}${job.company_name}${job.location}${extensions.posted_at || ''}`;
//       const jobId = crypto
//         .createHash('md5')
//         .update(idSource)
//         .digest('hex')
//         .substring(0, 12);

//       const applyUrl = job.related_links?.[0]?.link || 
//                       job.apply_link || 
//                       job.job_link || 
//                       null;

//       const requirements = extractRequirements(cleanDescription);

//       return {
//         id: jobId,
//         title: job.title ? job.title.replace(/[^\w\s,-]/g, '') : '',
//         company: job.company_name || '',
//         location: job.location || 'Not specified',
//         description: cleanDescription,
//         salary: job.salary || extensions.salary || 'Not specified',
//         postedTime: extensions.posted_at || job.posted_time || 'Not specified',
//         type: extensions.schedule_type || job.job_type || 'Full-time',
//         locationType: extensions.work_from_home ? 'Remote' : 'On-site',
//         applyUrl: applyUrl,
//         requirements: requirements,
//         highlights: job.highlights || [],
//         thumbnail: job.thumbnail || null,
//         via: job.via || null
//       };
//     });

//     // Find the specific job
//     const job = jobs.find(job => job.id === id);
    
//     if (!job) {
//       return res.status(404).json({ 
//         error: 'Job not found',
//         message: `No job found with id: ${id}`
//       });
//     }

//     // Calculate match score
//     const matchingService = new JobMatchingService();
//     const matchResult = await matchingService.calculateMatchScore(job, user.resumeText, 'api');
    
//     // Return job with match score
//     return res.status(200).json({
//       ...job,
//       matchScore: matchResult
//     });

//   } catch (error) {
//     console.error("Error in getJobByIdWithMatching:", error);
//     return res.status(500).json({ 
//       error: 'Failed to fetch job details and calculate match',
//       details: error.message
//     });
//   }
// };

// // Update your routes
// // const router = express.Router();

// // // Replace existing getJobById route with the new one
// // router.get('/jobs/:id', getJobByIdWithMatching);

// module.exports = {
//   getJobByIdWithMatching
// };