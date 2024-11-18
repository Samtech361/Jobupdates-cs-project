const OpenAI = require('openai');
const User = require('../models/users.models');

class ResumeRecommendationsService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async generateRecommendations(jobData, resumeText) {
    try {
      const prompt = this._constructPrompt(jobData, resumeText);
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "user",
          content: prompt
        }],
        temperature: 0.7,
        max_tokens: 1500
      });

      const recommendations = this._parseResponse(response.choices[0].message.content);
      return recommendations;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw new Error('Failed to generate resume recommendations');
    }
  }

  _constructPrompt(jobData, resumeText) {
    return `
      As an expert resume consultant and career advisor, analyze the following job description and resume. 
      Provide detailed recommendations for improving the resume to better match the job requirements.

      JOB TITLE: ${jobData.title}
      JOB DESCRIPTION: ${jobData.description}
      
      REQUIREMENTS:
      ${jobData.requirements.join('\n')}

      CANDIDATE'S RESUME:
      ${resumeText}

      Please provide a structured analysis including:
      1. Skills Gap Analysis: Identify key skills from the job description that are missing or need strengthening in the resume
      2. Missing Keywords: Important terms/technologies from the job posting that should be added to the resume
      3. Specific Recommendations: Actionable suggestions for improving the resume
      4. Resume Modifications: Specific sections or bullet points that could be rewritten
      
      Format the response as a JSON object with these keys: skillsGap (array), missingKeywords (array), recommendations (array), resumeModifications (string).
    `;
  }

  _parseResponse(responseText) {
    try {
      // Cleaning up the response text to ensure it's valid JSON
      const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanedText);
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      throw new Error('Failed to parse recommendations');
    }
  }
}

const recommendationsService = new ResumeRecommendationsService();
module.exports = recommendationsService;

//controller
const getJobRecommendations = async (req, res) => {
  const { id: jobId } = req.params;

  try {
    // Get the user's resume text
    const user = await User.findById(req.user.id);
    if (!user?.resumeText) {
      return res.status(400).json({
        error: 'Resume not found',
        message: 'Please upload your resume before requesting recommendations'
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

    // Generate recommendations using the service instance
    const recommendations = await recommendationsService.generateRecommendations(
      job,
      user.resumeText
    );

    return res.status(200).json({ recommendations: JSON.stringify(recommendations) });
  } catch (error) {
    console.error('Error in getJobRecommendations:', error);
    return res.status(500).json({
      error: 'Failed to generate recommendations',
      message: error.message
    });
  }
};