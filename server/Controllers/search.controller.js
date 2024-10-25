const axios = require("axios");

const searchJobs = async (req, res) => {
  const query = req.body.query;
  const apiKey = process.env.APIKEY;

  try {
    const response = await axios.get(
      `https://serpapi.com/search.json?q=${encodeURIComponent(
        query || "Software developer"
      )}&engine=google_jobs&location=United+States&hl=en&api_key=${apiKey}`
    );

    // Add error checking for jobs_results
    if (!response.data.jobs_results) {
      throw new Error('No jobs results found in the API response');
    }
        
    const data = response.data.jobs_results.map((job) => {
      // Extract schedule type and remote info from extensions
      const extensions = job.detected_extensions || {};
      
      // Clean up the description - remove extra whitespace and special characters
      const cleanDescription = job.description
        ? job.description.replace(/\s+/g, ' ').trim()
        : '';

      return {
        title: job.title ? job.title.replace(/[^\w\s,-]/g, '') : '', // Clean up title
        company: job.company_name || '',
        location: job.location || 'Not specified',
        description: cleanDescription,
        salary: job.salary || extensions.salary || 'Not specified',
        postedTime: extensions.posted_at || job.posted_time || 'Not specified',
        type: extensions.schedule_type || job.job_type || 'Full-time',
        locationType: extensions.work_from_home ? 'Remote' : 'On-site'
      };
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error in searchJobs:", error);
    return res.status(500).json({ 
      error: "Failed to fetch jobs",
      details: error.message,
      query: query 
    });
  }
};

module.exports = searchJobs;