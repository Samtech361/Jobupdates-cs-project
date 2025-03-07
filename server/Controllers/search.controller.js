const axios = require("axios");
const crypto = require('crypto');
const User = require('../models/users.models')
const JobMatchingService = require('../services/matchingService')
const techSkillsAnalyzer = require('../services/analysis.service');

const mockData = require('../MOCK_DATA.json')

const formatJobData = (job) => {
  const extensions = job.detected_extensions || {};
  
  // Clean up the description - remove extra whitespace and special characters
  const cleanDescription = job.description
    ? job.description.replace(/\s+/g, ' ').trim()
    : '';

  // Generate a unique ID using multiple fields to ensure consistency
  const idSource = `${job.title}${job.company_name}${job.location}${extensions.posted_at || ''}`;
  const jobId = crypto
    .createHash('md5')
    .update(idSource)
    .digest('hex')
    .substring(0, 12); // Using first 12 characters for a shorter ID

  // Extract any available links
  const applyUrl = job.related_links?.[0]?.link || 
                  job.apply_link || 
                  job.job_link || 
                  null;

  // Extract requirements from the description
  const requirements = extractRequirements(cleanDescription);

  return {
    id: jobId,
    title: job.title ? job.title.replace(/[^\w\s,-]/g, '') : '', 
    company: job.company_name || '',
    location: job.location || 'Not specified',
    description: cleanDescription,
    salary: job.salary || extensions.salary || 'Not specified',
    postedTime: extensions.posted_at || job.posted_time || 'Not specified',
    type: extensions.schedule_type || job.job_type || 'Full-time',
    locationType: extensions.work_from_home ? 'Remote' : 'On-site',
    applyUrl: applyUrl,
    requirements: requirements,
    highlights: job.highlights || [],
    thumbnail: job.thumbnail || null,
    via: job.via || null
  };
};

const searchJobs = async (req, res) => {
  const query = req.body.query;
  const apiKey = process.env.APIKEY;

  try {
    const response = await axios.get(
      `https://serpapi.com/search.json?q=${encodeURIComponent(
        query || "Software developer"
      )}&engine=google_jobs&location=United+States&hl=en&api_key=${apiKey}`
    );
    // const response = mockData

    //Add error checking for jobs_results
    if (!response.data.jobs_results) {
      throw new Error('No jobs results found in the API response');
    }
        
    const data = response.data.jobs_results.map(formatJobData);

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

const getJobById = async (req, res) => {
  const { id } = req.params;
  const searchQuery = req.query.searchQuery || "software developer";
  const apiKey = process.env.APIKEY;

  try {
    const user = await User.findById(req.user.id);
    const hasResume = Boolean(user?.resumeText);

    //Fetch jobs using the search query
    const response = await axios.get(
      `https://serpapi.com/search.json?q=${encodeURIComponent(
        searchQuery
      )}&engine=google_jobs&location=United+States&hl=en&api_key=${apiKey}`
    );

    if (!response.data.jobs_results) {
      return res.status(404).json({ 
        error: 'No jobs found',
        message: 'No jobs found for the given search query'
      });
    }
    // const response = mockData

    const formatDescription = (description) => {
      if (!description) return '';
      
      // Normalize line endings and remove extra spaces
      let formatted = description
        .replace(/\r\n/g, '\n')
        .replace(/\s+/g, ' ')
        .trim();
        
      // Add double newlines before bullet points for frontend parsing
      formatted = formatted
        .replace(/([.!?])\s*(•|-)/g, '$1\n\n•')
        .replace(/([.!?])\s*([A-Z])/g, '$1\n\n$2');
        
      return formatted;
    };

    const jobs = response.data.jobs_results.map(formatJobData);

    // Find the job with the matching ID
    const job = jobs.find(job => job.id === id);
    
    if (!job) {
      return res.status(404).json({ 
        error: 'Job not found',
        message: `No job found with id: ${id}`
      });
    }

    if (hasResume) {
      const matchingService = new JobMatchingService();
      const matchScore = matchingService.calculateMatchScore(job, user.resumeText);
            
      return res.status(200).json({
        ...job,
        matchScore
      });
    }
    
    return res.status(200).json(job);
  } catch (error) {
    console.error("Error in getJobById:", error);
    return res.status(500).json({ 
      error: 'Failed to fetch job details',
      details: error.message
    });
  }
};

// Helper function to extract requirements from job description
const extractRequirements = (description) => {
  const requirements = [];
  
  // Split description into paragraphs
  const paragraphs = description.split(/\n|\. /);
  
  // Look for common requirement indicators
  const requirementIndicators = [
    'required', 'requirements', 'qualifications', 
    'must have', 'skills needed', 'you should', 
    'you must', 'we need', 'looking for'
  ];

  paragraphs.forEach(paragraph => {
    const lowerParagraph = paragraph.toLowerCase();
    if (requirementIndicators.some(indicator => lowerParagraph.includes(indicator))) {
      // Clean up the requirement text
      const requirement = paragraph.trim()
        .replace(/^[•\-\*]\s*/, '') // Remove bullet points
        .replace(/^(required|requirements|qualifications):\s*/i, '') // Remove headers
        .trim();
      
      if (requirement && requirement.length > 10) { // Only add substantial requirements
        requirements.push(requirement);
      }
    }
  });

  // If no requirements were found, try to identify skill-based statements
  if (requirements.length === 0) {
    const skillIndicators = [
      'experience with', 'knowledge of', 'familiarity with',
      'proficiency in', 'ability to', 'understanding of'
    ];

    paragraphs.forEach(paragraph => {
      const lowerParagraph = paragraph.toLowerCase();
      if (skillIndicators.some(indicator => lowerParagraph.includes(indicator))) {
        const requirement = paragraph.trim();
        if (requirement && requirement.length > 10) {
          requirements.push(requirement);
        }
      }
    });
  }

  return requirements;
};

const getJobRecommendations = async (req, res) => {
  const { id: jobId } = req.params;

  try {
    // Get the user's resume text
    const user = await User.findById(req.user.id);
    if (!user?.resumeText) {
      return res.status(400).json({
        error: 'Resume not found',
        message: 'Please upload your resume before requesting analysis'
      });
    }

    const searchQuery = req.query.searchQuery || "software developer";
    const apiKey = process.env.APIKEY;
    const jobResponse = await axios.get(
      `https://serpapi.com/search.json?q=${encodeURIComponent(
        searchQuery
      )}&engine=google_jobs&location=United+States&hl=en&api_key=${apiKey}`
    );

    const jobs = jobResponse.data.jobs_results.map(formatJobData);
    const job = jobs.find(j => j.id === jobId);

    if (!job) {
      return res.status(404).json({
        error: 'Job not found',
        message: `No job found with id: ${jobId}`
      });
    }

    
    const analysis = techSkillsAnalyzer.analyzeSkills(job, user.resumeText);

    return res.status(200).json(analysis);
  } catch (error) {
    console.error('Error in analyzeResume:', error);
    return res.status(500).json({
      error: 'Failed to analyze resume',
      message: error.message
    });
  }
};

module.exports = {searchJobs, getJobById,getJobRecommendations};