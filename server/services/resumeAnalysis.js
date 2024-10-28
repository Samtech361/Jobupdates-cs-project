const ResumeAnalysisService = require('./enhancedResumeService');

function analyzeResume(text) {
    const keywords = ['javascript', 'react', 'node', 'express', 'mongodb', 'sql', 'python', 'java', 'c++'];
    const foundKeywords = keywords.filter(keyword => text.toLowerCase().includes(keyword));
    
    const sentences = text.split(/[.!?]+/);
    const wordCount = text.split(/\s+/).length;
  
    return {
      keywordMatches: foundKeywords,
      sentenceCount: sentences.length,
      wordCount: wordCount
    };
  }
  
  module.exports = {
    analyzeResume: ResumeAnalysisService.analyzeResume.bind(ResumeAnalysisService)
  };
