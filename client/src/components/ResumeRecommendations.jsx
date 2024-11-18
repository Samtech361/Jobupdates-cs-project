import React, { useState } from 'react';
import { Loader2, XCircle, AlertCircle } from 'lucide-react';
import axios from '../components/axios';
import tokenService from '../utils/tokenRefresh';

const TechSkillsGap = ({ jobId }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeTechSkills = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const searchQuery = localStorage.getItem('lastSearchQuery');
      const response = await axios.get(`/api/jobs/${jobId}/recommendations`, {
        params: { searchQuery }
      });
      
      setAnalysis(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        tokenService.logout();
        return;
      }
      
      setError(
        error.response?.data?.message || 
        'Failed to analyze technical skills. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const CategorySection = ({ title, skills }) => {
    if (!skills || skills.length === 0) return null;
    
    return (
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">{title}</h4>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-8 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Technical Skills Gap Analysis</h2>
        <button
          onClick={analyzeTechSkills}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Analyze Skills'
          )}
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
          <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-red-800">Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {analysis && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Missing Technical Skills
            </h3>
            <p className="text-gray-600 mb-4">
              These technical skills are required for the job but not found in your resume:
            </p>
            
            {Object.keys(analysis.missing).map(category => (
              <CategorySection 
                key={category}
                title={category.charAt(0).toUpperCase() + category.slice(1)}
                skills={analysis.missing[category]}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TechSkillsGap;