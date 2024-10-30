const axios = require('axios');

class AIRecommendationService {
  constructor() {
    if (!process.env.HUGGING_FACE_API_KEY) {
      throw new Error('HUGGING_FACE_API_KEY environment variable is not set');
    }
    
    this.hfToken = process.env.HUGGING_FACE_API_KEY;
    this.modelEndpoint = "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2";
    this.keywordModelEndpoint = "https://api-inference.huggingface.co/models/ml6team/keyphrase-extraction-kbir-inspec";
    // Add Llama model endpoint
    this.llamaEndpoint = "https://api-inference.huggingface.co/models/meta-llama/Llama-3.1-8B";
    
    this.client = axios.create({
      headers: {
        'Authorization': `Bearer ${this.hfToken}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
  }

  async queryLlama(prompt) {
    try {
      await this.waitForModel(this.llamaEndpoint);
      
      const response = await this.client.post(this.llamaEndpoint, {
        inputs: prompt
        // Note: Keeping parameters minimal as per your example
        // Add parameters if needed:
        // parameters: {
        //   max_length: 1000,
        //   temperature: 0.7,
        // }
      });

      if (!response.data) {
        throw new Error('Empty response from Llama model');
      }

      // Handle Llama response format
      if (Array.isArray(response.data)) {
        return response.data[0].generated_text;
      } else if (typeof response.data === 'string') {
        return response.data;
      } else {
        return response.data.generated_text || response.data.text;
      }
    } catch (error) {
      console.error('Llama query error:', error);
      throw this.handleApiError(error);
    }
  }

  async waitForModel(endpoint, isEmbeddingModel = false) {
    const maxRetries = 3;
    let retries = 0;
    
    while (retries < maxRetries) {
      try {
        const testPayload = isEmbeddingModel 
          ? { inputs: { source_sentence: "Test", sentences: ["Test"] } }
          : { inputs: "Test" };

        const response = await this.client.post(endpoint, testPayload);
        return true;
      } catch (error) {
        if (error.response?.data?.error?.includes('Model is loading')) {
          console.log(`Model is loading, attempt ${retries + 1} of ${maxRetries}...`);
          await new Promise(resolve => setTimeout(resolve, 20000));
          retries++;
        } else if (error.response?.status === 200) {
          return true;
        } else {
          throw this.handleApiError(error);
        }
      }
    }
    throw new Error('Model failed to load after maximum retries');
  }

  handleApiError(error) {
    if (error.response) {
      // Log the full error response for debugging
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });

      if (error.response.status === 401) {
        return new Error('Invalid API key. Please check your HUGGING_FACE_API_KEY.');
      } else if (error.response.status === 429) {
        return new Error('Rate limit exceeded. Please try again later.');
      } else if (error.response.status === 503) {
        return new Error('Model is currently loading. Please try again in a few moments.');
      }
      return new Error(`API Error: ${error.response.data.error || error.response.statusText}`);
    } else if (error.request) {
      return new Error('No response received from the API. Please check your internet connection.');
    }
    return new Error(`Request configuration error: ${error.message}`);
  }

  async getEmbeddings(text) {
    try {
      await this.waitForModel(this.modelEndpoint, true);
      
      const response = await this.client.post(this.modelEndpoint, {
        inputs: {
          source_sentence: text,
          sentences: [text]
        }
      });

      if (!response.data || !Array.isArray(response.data)) {
        console.error('Unexpected embedding response format:', response.data);
        throw new Error('Unexpected API response format for embeddings');
      }

      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  async extractKeywords(text) {
    try {
      await this.waitForModel(this.keywordModelEndpoint);
      
      // Split text into chunks if it's too long (API typically has a token limit)
      const maxChunkLength = 512; // Typical token limit for transformers
      let keywords = new Set();
      
      for (let i = 0; i < text.length; i += maxChunkLength) {
        const chunk = text.slice(i, i + maxChunkLength);
        const response = await this.client.post(this.keywordModelEndpoint, { 
          inputs: chunk,
          parameters: { max_length: 512 }
        });

        // Log the response for debugging
        console.log('Keyword extraction response:', response.data);

        // Handle the response based on the model's output format
        if (Array.isArray(response.data)) {
          response.data.forEach(item => {
            if (typeof item === 'string') {
              keywords.add(item.toLowerCase());
            } else if (Array.isArray(item) && item.length > 0) {
              keywords.add(item[0].toLowerCase());
            } else if (item.keyword) {
              keywords.add(item.keyword.toLowerCase());
            } else if (item.word) {
              keywords.add(item.word.toLowerCase());
            }
          });
        } else {
          console.error('Unexpected keyword response format:', response.data);
          throw new Error('Unexpected API response format for keywords');
        }
      }

      // Convert Set to Array and remove any empty strings or duplicates
      return Array.from(keywords)
        .filter(keyword => keyword && keyword.trim().length > 0)
        .map(keyword => keyword.trim());
    } catch (error) {
      console.error('Keyword extraction error:', error);
      throw this.handleApiError(error);
    }
  }

  calculateSimilarity(embedding1, embedding2) {
    if (!Array.isArray(embedding1) || !Array.isArray(embedding2) || 
        embedding1.length !== embedding2.length) {
      throw new Error('Invalid embeddings format');
    }
    
    const dotProduct = embedding1.reduce((sum, val, i) => sum + val * embedding2[i], 0);
    const magnitude1 = Math.sqrt(embedding1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(embedding2.reduce((sum, val) => sum + val * val, 0));
    
    if (magnitude1 === 0 || magnitude2 === 0) {
      throw new Error('Invalid embedding vectors - zero magnitude');
    }
    
    return dotProduct / (magnitude1 * magnitude2);
  }

  async getEnhancedRecommendations(jobDescription, resumeText) {
    // First get standard recommendations
    const baseRecommendations = await this.getRecommendations(jobDescription, resumeText);
    
    try {
      // Create a prompt for Llama
      const prompt = `
        Task: Analyze the match between a job description and resume, then provide specific recommendations.

        Job Description: ${jobDescription}
        Resume: ${resumeText}
        Match Score: ${baseRecommendations.matchScore}%
        Missing Keywords: ${baseRecommendations.skillsGapAnalysis.missingKeywords.join(', ')}
        
        Please provide:
        1. Specific suggestions for improving the resume
        2. Key skills to highlight or develop
        3. Concrete steps for better alignment with the job requirements
      `;

      const llamaInsights = await this.queryLlama(prompt);

      return {
        ...baseRecommendations,
        aiInsights: llamaInsights,
        enhancedRecommendations: [
          ...baseRecommendations.recommendations,
          "AI-Generated Insights:",
          llamaInsights
        ]
      };
    } catch (error) {
      console.warn('Llama enhancement failed, returning base recommendations:', error);
      return baseRecommendations;
    }
  }

  getOverallRecommendation(score) {
    if (score < 0.4) return "Consider a significant revision of your resume to better match the job requirements";
    if (score < 0.6) return "Make substantial adjustments to better align with job requirements";
    if (score < 0.8) return "Make moderate adjustments to better align with job requirements";
    return "Your resume is well-aligned with the job requirements";
  }

  getMatchLevel(score) {
    if (score >= 0.8) return "Strong";
    if (score >= 0.6) return "Moderate";
    if (score >= 0.4) return "Fair";
    return "Needs Improvement";
  }

  getConfidenceLevel(jobKeywordsCount, resumeKeywordsCount) {
    const keywordRatio = Math.min(jobKeywordsCount, resumeKeywordsCount) / 
                        Math.max(jobKeywordsCount, resumeKeywordsCount);
    if (keywordRatio >= 0.8) return "High";
    if (keywordRatio >= 0.5) return "Medium";
    return "Low";
  }
}

module.exports = AIRecommendationService;