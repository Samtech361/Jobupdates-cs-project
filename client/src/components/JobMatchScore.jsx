import React from 'react';
import { AlertCircle } from 'lucide-react';

// Custom Progress Bar Component
const ProgressBar = ({ value, className = '' }) => (
  <div className={`w-full bg-gray-200 rounded-full ${className}`}>
    <div 
      className={`h-full rounded-full transition-all duration-300 ease-in-out ${className}`}
      style={{ width: `${value}%` }}
    />
  </div>
);

const JobMatchScore = ({ matchScore }) => {
  if (!matchScore) return null;

  const { overall, details } = matchScore;
  
  const scoreCategories = [
    { name: 'Skills Match', score: details.skills, description: 'Match with required technical skills and competencies' },
    { name: 'Requirements', score: details.requirements, description: 'Match with job requirements and qualifications' },
    { name: 'Experience', score: details.experience, description: 'Match with required years and type of experience' },
    { name: 'Education', score: details.education, description: 'Match with educational requirements' }
  ];

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Match Score</h2>
        <div className="relative group">
          <AlertCircle className="h-5 w-5 text-gray-400 cursor-help" />
          <div className="hidden group-hover:block absolute right-0 w-64 p-2 mt-2 text-sm bg-gray-800 text-white rounded-md shadow-lg z-10">
            This score is calculated based on how well your resume matches the job requirements
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-medium">Overall Match</span>
          <span className="text-2xl font-bold">{overall}%</span>
        </div>
        <ProgressBar 
          value={overall} 
          className={`h-3 ${getScoreColor(overall)}`}
        />
      </div>

      <div className="grid gap-4">
        {scoreCategories.map(({ name, score, description }) => (
          <div key={name}>
            <div className="flex justify-between items-center mb-1">
              <div className="relative group">
                <span className="text-sm font-medium text-gray-600 cursor-help">
                  {name}
                </span>
                <div className="hidden group-hover:block absolute left-0 w-64 p-2 mt-2 text-sm bg-gray-800 text-white rounded-md shadow-lg z-10">
                  {description}
                </div>
              </div>
              <span className="text-sm font-medium">{score}%</span>
            </div>
            <ProgressBar 
              value={score} 
              className={`h-2 ${getScoreColor(score)}`}
            />
          </div>
        ))}
      </div>

      {overall < 60 && (
        <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <p>
            Your match score is below 60%. Consider updating your resume to better highlight relevant skills and experience.
          </p>
        </div>
      )}
    </div>
  );
};

export default JobMatchScore;