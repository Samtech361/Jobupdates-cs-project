const { CohereClient } = require('cohere-ai');
const User = require('../models/users.models');

class ResumeRecommendationsService {
  constructor() {
    this.cohere = new CohereClient({
      token: process.env.COHERE_API_KEY
    });
  }

  async generateRecommendations(jobData, resumeText) {
    try {
      const prompt = this._constructPrompt(jobData, resumeText);
      
      const response = await this.cohere.generate({
        model: 'command',  // Cohere's most capable model for complex tasks
        prompt: prompt,
        maxTokens: 1500,  // Note: camelCase in the new SDK
        temperature: 0.7,
        format: 'json',
        stopSequences: ['}'], // Note: camelCase in the new SDK
        returnLikelihoods: 'NONE'
      });

      // Response structure has changed in the new SDK
      const recommendations = this._parseResponse(response.generations[0].text);
      return recommendations;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw new Error('Failed to generate resume recommendations');
    }
  }

  _constructPrompt(jobData, resumeText) {
    return `
      You are an expert resume consultant and career advisor. Analyze the following job description and resume.
      Your task is to provide detailed recommendations for improving the resume to better match the job requirements.
      
      JOB TITLE: ${jobData.title}
      JOB DESCRIPTION: ${jobData.description}
      
      REQUIREMENTS:
      ${jobData.requirements.join('\n')}

      CANDIDATE'S RESUME:
      ${resumeText}

      Generate a JSON object with the following analysis:
      {
        "skillsGap": [List of key skills from the job description that are missing or need strengthening in the resume],
        "missingKeywords": [Important terms/technologies from the job posting that should be added to the resume],
        "recommendations": [Actionable suggestions for improving the resume],
        "resumeModifications": "Detailed string explaining specific sections or bullet points that could be rewritten"
      }

      Ensure your response is a valid JSON object containing only the requested fields.
    `;
  }

  _parseResponse(responseText) {
    try {
      // Clean up the response text to ensure it's valid JSON
      let cleanedText = responseText.trim();
      
      // If the response starts with a markdown code block, remove it
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/```json\n/, '').replace(/\n```$/, '');
      }
      
      // Handle potential trailing commas
      cleanedText = cleanedText.replace(/,(\s*[}\]])/g, '$1');
      
      return JSON.parse(cleanedText);
    } catch (error) {
      console.error('Error parsing Cohere response:', error);
      throw new Error('Failed to parse recommendations');
    }
  }
}

const recommendationsService = new ResumeRecommendationsService();
module.exports = recommendationsService;