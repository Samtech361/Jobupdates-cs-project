const axios = require('axios');

class AIRecommendationService {
  constructor() {
    if (!process.env.HUGGING_FACE_API_KEY) {
      throw new Error('HUGGING_FACE_API_KEY environment variable is not set');
    }
    
    this.hfToken = process.env.HUGGING_FACE_API_KEY;
    this.modelEndpoint = "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2";
    // Changed to a more reliable keyword extraction model
    this.keywordModelEndpoint = "https://api-inference.huggingface.co/models/ml6team/keyphrase-extraction-kbir-inspec";
    
    this.client = axios.create({
      headers: {
        'Authorization': `Bearer ${this.hfToken}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
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

  async getRecommendations(jobDescription, resumeText) {
    if (!jobDescription || !resumeText) {
      throw new Error('Both job description and resume text are required');
    }

    try {
      console.log('Processing job description and resume...');
      // Get embeddings and keywords concurrently
      const [
        [jobEmbedding, resumeEmbedding],
        [jobKeywords, resumeKeywords]
      ] = await Promise.all([
        Promise.all([
          this.getEmbeddings(jobDescription),
          this.getEmbeddings(resumeText)
        ]),
        Promise.all([
          this.extractKeywords(jobDescription),
          this.extractKeywords(resumeText)
        ])
      ]);

      console.log('Keywords extracted:', {
        jobKeywords,
        resumeKeywords
      });

      const similarityScore = this.calculateSimilarity(jobEmbedding[0], resumeEmbedding[0]);
      
      const missingKeywords = jobKeywords.filter(keyword => 
        !resumeKeywords.some(resumeKw => 
          resumeKw.includes(keyword) || keyword.includes(resumeKw)
        )
      );

      const matchingKeywords = jobKeywords.filter(keyword => 
        resumeKeywords.some(resumeKw => 
          resumeKw.includes(keyword) || keyword.includes(resumeKw)
        )
      );

      return {
        matchScore: Math.round(similarityScore * 100),
        skillsGapAnalysis: {
          missingKeywords,
          matchingKeywords
        },
        recommendations: [
          missingKeywords.length > 0 ? "Consider adding these missing keywords to your resume:" : 
                                     "Your resume contains most of the key skills mentioned in the job description.",
          ...missingKeywords.map(keyword => `- Include experience or skills related to ${keyword}`),
          this.getOverallRecommendation(similarityScore)
        ],
        suggestedModifications: {
          addKeywords: missingKeywords,
          overallMatch: this.getMatchLevel(similarityScore),
          confidence: this.getConfidenceLevel(jobKeywords.length, resumeKeywords.length)
        }
      };
    } catch (error) {
      console.error('Error in recommendation generation:', error);
      throw new Error(`Failed to generate resume recommendations: ${error.message}`);
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