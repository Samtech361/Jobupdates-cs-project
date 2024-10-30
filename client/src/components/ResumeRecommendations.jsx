import React, { useState } from 'react';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const ResumeRecommendations = ({ jobId }) => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`/api/jobs/${jobId}/recommendations`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });
      
      const data = JSON.parse(response.data.recommendations);
      setRecommendations(data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to get recommendations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Resume Recommendations</h2>
        <button
          onClick={fetchRecommendations}
          disabled={loading}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-md
            bg-blue-600 text-white font-medium
            hover:bg-blue-700 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Get Recommendations'
          )}
        </button>
      </div>

      {error && (
        <div className="flex gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
          <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-red-800">Error</h4>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {recommendations && (
        <div className="space-y-6 bg-white rounded-lg shadow-lg p-6">
          {/* Skills Gap Analysis */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Skills Gap Analysis</h3>
            <ul className="list-disc pl-5 space-y-1">
              {recommendations.skillsGap.map((skill, index) => (
                <li key={index} className="text-gray-700">{skill}</li>
              ))}
            </ul>
          </div>

          {/* Missing Keywords */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Missing Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {recommendations.missingKeywords.map((keyword, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Specific Recommendations */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Recommendations</h3>
            <ul className="space-y-2">
              {recommendations.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Resume Modifications */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Suggested Resume Updates</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm text-gray-700">
                {recommendations.resumeModifications}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeRecommendations;