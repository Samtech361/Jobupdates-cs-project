class ResumeAnalysisService {
  constructor() {
    this.technicalSkills = [
      'javascript', 'react', 'node', 'express', 'mongodb', 'sql', 
      'python', 'java', 'c\\+\\+',
      'aws', 'docker', 'kubernetes',
      'html', 'css', 'angular', 'vue', 'typescript', 'graphql',
      'rest', 'api', 'git', 'ci/cd', 'agile', 'scrum'
    ];

    this.softSkills = [
      'communication', 'leadership', 'teamwork', 'problem solving',
      'time management', 'critical thinking', 'collaboration',
      'adaptability', 'creativity', 'organization'
    ];
  }

  /**
   * Main entry point for resume analysis
   * @param {Object} resumeData - Contains resume text and metadata
   * @param {string} resumeData.text - The resume text content
   * @param {string} [resumeData.id] - Optional resume ID
   * @returns {Object} Complete analysis results
   * @throws {Error} If required data is missing or invalid
   */
  async analyzeResume(resumeData) {
    try {
      // Input validation
      if (!resumeData || typeof resumeData !== 'object') {
        throw new Error('Invalid resume data provided');
      }

      const { text, id } = resumeData;

      if (!text || typeof text !== 'string') {
        throw new Error('Resume text is required and must be a string');
      }

      // Initialize analysis object with resume ID if provided
      const analysis = {
        id: id || null,
        timestamp: new Date().toISOString(),
        status: 'processing',
        errors: [],
        basicMetrics: null,
        technicalSkills: null,
        softSkills: null,
        experience: null,
        education: null,
        completenessScore: null
      };

      try {
        // Pre-process text
        const processedText = this.preProcessText(text);
        analysis.processedText = processedText;

        // Perform analysis components
        analysis.basicMetrics = this.getBasicMetrics(text);
        analysis.technicalSkills = this.extractTechnicalSkills(text);
        analysis.softSkills = this.extractSoftSkills(text);
        analysis.experience = this.extractExperience(text);
        analysis.education = this.extractEducation(text);
        analysis.completenessScore = this.calculateCompletenessScore(analysis);
        analysis.status = 'completed';

      } catch (error) {
        analysis.errors.push({
          component: 'analysis',
          message: error.message,
          timestamp: new Date().toISOString()
        });
        analysis.status = 'partial';
      }

      return analysis;

    } catch (error) {
      throw new Error(`Resume analysis failed: ${error.message}`);
    }
  }

  /**
   * Pre-processes text for analysis
   * @param {string} text 
   * @returns {string}
   */
  preProcessText(text) {
    if (typeof text !== 'string') {
      throw new Error('Input text must be a string');
    }
    return text.toLowerCase()
               .replace(/\s+/g, ' ')
               .replace(/[^\w\s+]/g, ' ')
               .trim();
  }

  /**
   * Calculates basic text metrics
   * @param {string} text 
   * @returns {Object}
   */
  getBasicMetrics(text) {
    if (!text) return null;

    const words = text.split(/\s+/);
    return {
      wordCount: words.length,
      sentenceCount: text.split(/[.!?]+/).length,
      characterCount: text.length,
      averageWordLength: words.length > 0 ? 
        words.reduce((acc, word) => acc + word.length, 0) / words.length : 0
    };
  }

  /**
   * Extracts and analyzes technical skills
   * @param {string} text 
   * @returns {Object}
   */
  extractTechnicalSkills(text) {
    if (!text) return { found: [], frequency: {} };
    
    const processedText = this.preProcessText(text);
    return {
      found: this.technicalSkills.filter(skill => {
        try {
          return new RegExp(`\\b${skill}\\b`, 'i').test(processedText);
        } catch (error) {
          console.warn(`Invalid skill pattern: ${skill}`);
          return false;
        }
      }),
      frequency: this.calculateTermFrequency(processedText, this.technicalSkills)
    };
  }

  /**
   * Extracts and analyzes soft skills
   * @param {string} text 
   * @returns {Object}
   */
  extractSoftSkills(text) {
    if (!text) return { found: [], frequency: {} };

    const processedText = this.preProcessText(text);
    return {
      found: this.softSkills.filter(skill => {
        try {
          return new RegExp(`\\b${skill}\\b`, 'i').test(processedText);
        } catch (error) {
          console.warn(`Invalid skill pattern: ${skill}`);
          return false;
        }
      }),
      frequency: this.calculateTermFrequency(processedText, this.softSkills)
    };
  }

  /**
   * Calculates frequency of terms in text
   * @param {string} text 
   * @param {string[]} terms 
   * @returns {Object}
   */
  calculateTermFrequency(text, terms) {
    const frequencies = {};
    terms.forEach(term => {
      try {
        const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escapedTerm}\\b`, 'gi');
        const matches = text.match(regex);
        frequencies[term] = matches ? matches.length : 0;
      } catch (error) {
        console.warn(`Invalid term pattern: ${term}`);
        frequencies[term] = 0;
      }
    });
    return frequencies;
  }

  /**
   * Extracts experience information
   * @param {string} text 
   * @returns {Object}
   */
  extractExperience(text) {
    if (!text) return { totalYears: null, experiences: [] };

    const experiencePatterns = [
      /(\d+)[\+]?\s*(?:years?|yrs?)\s+(?:of)?\s*experience/gi,
      /(?:worked|working)\s+(?:for|as)\s+(\d+)[\+]?\s*(?:years?|yrs?)/gi,
      /(\d+)[\+]?\s*(?:years?|yrs?)\s+(?:in|at)/gi
    ];

    const experiences = [];
    experiencePatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        experiences.push({
          years: parseInt(match[1], 10),
          context: text.substr(Math.max(0, match.index - 50), 100).trim()
        });
      }
    });

    return {
      totalYears: experiences.length > 0 ? 
        Math.max(...experiences.map(e => e.years)) : null,
      experiences
    };
  }

  /**
   * Extracts education information
   * @param {string} text 
   * @returns {Object}
   */
  extractEducation(text) {
    if (!text) return { highestDegree: null, degrees: [] };

    const educationPatterns = {
      phd: /ph\.?d\.?|doctorate/i,
      masters: /master'?s|mba|m\.s\.|m\.eng\./i,
      bachelors: /bachelor'?s|b\.s\.|b\.a\.|b\.eng\./i,
      associate: /associate'?s|a\.s\.|a\.a\./i
    };

    const education = {
      highestDegree: null,
      degrees: []
    };

    for (const [degree, pattern] of Object.entries(educationPatterns)) {
      if (pattern.test(text)) {
        education.degrees.push(degree);
      }
    }

    // Determine highest degree
    if (education.degrees.includes('phd')) education.highestDegree = 'phd';
    else if (education.degrees.includes('masters')) education.highestDegree = 'masters';
    else if (education.degrees.includes('bachelors')) education.highestDegree = 'bachelors';
    else if (education.degrees.includes('associate')) education.highestDegree = 'associate';

    return education;
  }

  /**
   * Calculates overall resume completeness score
   * @param {Object} analysis 
   * @returns {number}
   */
  calculateCompletenessScore(analysis) {
    if (!analysis) return 0;

    let score = 0;
    const weights = {
      technicalSkills: 0.3,
      softSkills: 0.2,
      experience: 0.25,
      education: 0.15,
      basicMetrics: 0.1
    };

    try {
      // Technical skills score
      if (analysis.technicalSkills?.found) {
        score += (analysis.technicalSkills.found.length / 10) * weights.technicalSkills;
      }
      
      // Soft skills score
      if (analysis.softSkills?.found) {
        score += (analysis.softSkills.found.length / 5) * weights.softSkills;
      }
      
      // Experience score
      if (analysis.experience?.totalYears) {
        score += Math.min(analysis.experience.totalYears / 10, 1) * weights.experience;
      }
      
      // Education score
      const educationScores = { phd: 1, masters: 0.8, bachelors: 0.6, associate: 0.4 };
      if (analysis.education?.highestDegree) {
        score += educationScores[analysis.education.highestDegree] * weights.education;
      }
      
      // Basic metrics score
      if (analysis.basicMetrics?.wordCount) {
        const wordCount = analysis.basicMetrics.wordCount;
        const basicMetricsScore = wordCount >= 300 && wordCount <= 600 ? 1 :
                                wordCount > 600 ? 0.8 :
                                wordCount / 300;
        score += basicMetricsScore * weights.basicMetrics;
      }

    } catch (error) {
      console.warn('Error calculating completeness score:', error);
      return 0;
    }

    return Math.min(Math.round(score * 100), 100);
  }

  /**
   * Prepares analysis results for job matching
   * @param {Object} resumeAnalysis 
   * @returns {Object}
   */
  async prepareForJobMatching(resumeAnalysis) {
    if (!resumeAnalysis) {
      throw new Error('Resume analysis results are required');
    }

    return {
      id: resumeAnalysis.id,
      processedText: resumeAnalysis.processedText,
      skills: {
        technical: resumeAnalysis.technicalSkills?.found || [],
        soft: resumeAnalysis.softSkills?.found || []
      },
      experience: resumeAnalysis.experience || { totalYears: null, experiences: [] },
      education: resumeAnalysis.education || { highestDegree: null, degrees: [] },
      completenessScore: resumeAnalysis.completenessScore || 0
    };
  }
}

module.exports = new ResumeAnalysisService();