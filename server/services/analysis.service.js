class TechSkillsAnalyzer {
  constructor() {
    // Common technical skills to look for
    this.techSkills = {
      languages: [
        'javascript', 'python', 'java', 'ruby', 'php', 'swift', 
        'kotlin', 'golang', 'typescript', 'rust', 'scala', 'perl', 'r', 
        'matlab', 'dart', 'lua', 'haskell', 'assembly'
      ],
      frontend: [
        'react', 'vue', 'angular', 'svelte', 'jquery', 'backbone', 'ember',
        'html', 'css', 'sass', 'less', 'tailwind', 'bootstrap', 'material-ui',
        'webpack', 'vite', 'babel', 'next.js', 'gatsby', 'redux', 'mobx'
      ],
      backend: [
        'node.js', 'express', 'django', 'flask', 'spring', 'laravel', 'rails',
        'fastapi', 'asp.net', 'graphql', 'rest', 'soap', 'grpc'
      ],
      databases: [
        'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch',
        'cassandra', 'oracle', 'dynamodb', 'firebase', 'neo4j', 'sqlite'
      ],
      cloud: [
        'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'terraform',
        'ansible', 'circleci', 'travis', 'netlify', 'heroku', 'vercel'
      ],
      testing: [
        'jest', 'mocha', 'cypress', 'selenium', 'junit', 'pytest', 'karma',
        'jasmine', 'enzyme', 'rtl', 'testing library', 'vitest'
      ],
      tools: [
        'git', 'npm', 'yarn', 'webpack', 'babel', 'eslint', 'prettier',
        'vscode', 'postman', 'jira', 'confluence', 'swagger'
      ],
      concepts: [
        'api', 'rest', 'graphql', 'mvc', 'orm', 'ci/cd', 'tdd', 'agile',
        'scrum', 'microservices', 'serverless', 'oauth', 'jwt'
      ]
    };
  }

  analyzeSkills(jobData, resumeText) {
    try {
      // Combine job description and requirements
      const jobText = `${jobData.description} ${jobData.requirements.join(' ')}`.toLowerCase();
      resumeText = resumeText.toLowerCase();

      // Find all tech skills mentioned in the job description
      const requiredSkills = this._findTechSkills(jobText);
      
      // Find all tech skills mentioned in the resume
      const resumeSkills = this._findTechSkills(resumeText);

      // Find missing skills (those in job description but not in resume)
      const missingSkills = {};
      
      for (const category in requiredSkills) {
        const missing = requiredSkills[category].filter(
          skill => !resumeSkills[category]?.includes(skill)
        );
        
        if (missing.length > 0) {
          missingSkills[category] = missing;
        }
      }

      return {
        required: requiredSkills,
        found: resumeSkills,
        missing: missingSkills
      };
    } catch (error) {
      console.error('Error analyzing tech skills:', error);
      throw new Error('Failed to analyze technical skills');
    }
  }

  _findTechSkills(text) {
    const foundSkills = {};
    
    // Helper function to check for skill matches
    const checkSkill = (skill) => {
      // Handle special cases with dots or special characters
      const searchTerm = skill.replace('.', '\\.');
      const regex = new RegExp(`\\b${searchTerm}\\b`, 'i');
      return regex.test(text);
    };

    // Search for skills in each category
    for (const [category, skills] of Object.entries(this.techSkills)) {
      const found = skills.filter(checkSkill);
      if (found.length > 0) {
        foundSkills[category] = found;
      }
    }

    return foundSkills;
  }
}

const SkillsAnalyzer = new TechSkillsAnalyzer();
module.exports = SkillsAnalyzer;