const axios = require("axios");


const searchJobs = async (query, apiKey) => {
  try {
    const response = await axios.get(
      `https://serpapi.com/search.json?q=${encodeURIComponent(
        query
      )}&engine=google_jobs&location=United+States&hl=en&api_key=${apiKey}`
    );

    return response.data.jobs_results.map((job) => ({
      title: job.title,
      company: job.company_name,
      location: job.location,
      description: job.description,
    }));
  } catch (error) {
    console.error("Error in searchJobs:", error);
    throw error;
  }
};

module.exports = searchJobs;
