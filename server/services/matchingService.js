const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

class JobMatchingService {
  constructor() {
    this.skillsWeight = 0.4;
    this.requirementsWeight = 0.3;
    this.experienceWeight = 0.2;
    this.educationWeight = 0.1;
  }

  calculateMatchScore(job, resumeText) {
    try {
      // Calculate individual scores
      const scores = {
        skills: this.calculateSkillsMatch(job, resumeText),
        requirements: this.calculateRequirementsMatch(job, resumeText),
        experience: this.calculateExperienceMatch(job, resumeText),
        education: this.calculateEducationMatch(job, resumeText)
      };

      // Calculate weighted total
      const totalScore = (
        (scores.skills * this.skillsWeight) +
        (scores.requirements * this.requirementsWeight) +
        (scores.experience * this.experienceWeight) +
        (scores.education * this.educationWeight)
      ) * 100;

      return {
        overall: Math.round(totalScore),
        details: {
          skills: Math.round(scores.skills * 100),
          requirements: Math.round(scores.requirements * 100),
          experience: Math.round(scores.experience * 100),
          education: Math.round(scores.education * 100)
        }
      };
    } catch (error) {
      console.error('Error calculating match score:', error);
      return {
        overall: 0,
        details: {
          skills: 0,
          requirements: 0,
          experience: 0,
          education: 0
        }
      };
    }
  }

  calculateSkillsMatch(job, resumeText) {
    const jobSkills = this.extractSkills(job.description);
    const resumeSkills = this.extractSkills(resumeText);
    
    if (jobSkills.length === 0) return 0;

    const matchedSkills = jobSkills.filter(skill => 
      resumeSkills.some(resumeSkill => 
        resumeSkill.toLowerCase() === skill.toLowerCase()
      )
    );

    return matchedSkills.length / jobSkills.length;
  }

  calculateRequirementsMatch(job, resumeText) {
    if (!job.requirements || job.requirements.length === 0) return 0;

    const matches = job.requirements.map(req => {
      const reqWords = tokenizer.tokenize(req.toLowerCase());
      const resumeWords = tokenizer.tokenize(resumeText.toLowerCase());
      
      const matchedWords = reqWords.filter(word => 
        resumeWords.includes(word)
      );

      return matchedWords.length / reqWords.length;
    });

    return matches.reduce((acc, score) => acc + score, 0) / matches.length;
  }

  calculateExperienceMatch(job, resumeText) {
    // Extract years of experience from job description
    const expMatch = job.description.match(/(\d+)[\+]?\s*(?:year|yr)s?/i);
    if (!expMatch) return 0.5; // Default score if no explicit requirement

    const requiredYears = parseInt(expMatch[1]);
    
    // Try to find years of experience in resume
    const resumeExpMatch = resumeText.match(/(\d+)[\+]?\s*(?:year|yr)s?/i);
    if (!resumeExpMatch) return 0.3; // Low score if no experience mentioned

    const resumeYears = parseInt(resumeExpMatch[1]);
    
    // Calculate score based on years
    if (resumeYears >= requiredYears) return 1.0;
    if (resumeYears >= requiredYears * 0.7) return 0.8;
    if (resumeYears >= requiredYears * 0.5) return 0.5;
    return 0.3;
  }

  calculateEducationMatch(job, resumeText) {
    const educationLevels = {
      'phd': 5,
      'doctorate': 5,
      'masters': 4,
      'bachelors': 3,
      'associate': 2,
      'certification': 1
    };

    // Find highest education level mentioned in job
    let jobEduLevel = 0;
    for (const [level, value] of Object.entries(educationLevels)) {
      if (job.description.toLowerCase().includes(level)) {
        jobEduLevel = Math.max(jobEduLevel, value);
      }
    }

    // Find highest education level in resume
    let resumeEduLevel = 0;
    for (const [level, value] of Object.entries(educationLevels)) {
      if (resumeText.toLowerCase().includes(level)) {
        resumeEduLevel = Math.max(resumeEduLevel, value);
      }
    }

    if (jobEduLevel === 0) return 0.5; // No specific requirement
    if (resumeEduLevel >= jobEduLevel) return 1.0;
    if (resumeEduLevel >= jobEduLevel - 1) return 0.7;
    return 0.3;
  }

  extractSkills(text) {
    // Common technical skills to look for
    const commonSkills = [
      'javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'php',
      'html', 'css', 'react', 'angular', 'vue', 'node', 'express',
      'mongodb', 'sql', 'mysql', 'postgresql', 'aws', 'azure',
      'docker', 'kubernetes', 'git', 'agile', 'scrum', 'rest',
      'api', 'graphql', 'typescript', 'jquery', 'sass', 'less',
      'redux', 'webpack', 'jenkins', 'ci/cd', 'linux', 'unix',
      'spring', 'hibernate', '.net', 'django', 'flask', 'laravel'
    ];

    const found = commonSkills.filter(skill => 
      text.toLowerCase().includes(skill.toLowerCase())
    );

    return Array.from(new Set(found)); // Remove duplicates
  }
}

module.exports = JobMatchingService