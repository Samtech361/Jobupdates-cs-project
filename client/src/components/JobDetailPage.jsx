import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../components/axios';

function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [matchPercentage, setMatchPercentage] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const [jobResponse, matchResponse] = await Promise.all([
          axios.get(`/api/jobs/${id}`, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true
          }),
          axios.post('/api/match-percentage', 
            { jobId: id },
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true
            }
          )
        ]);

        setJob(jobResponse.data);
        setMatchPercentage(matchResponse.data.percentage);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching job details:', error);
        setIsLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  if (isLoading) {
    return <div className="max-w-4xl mx-auto px-4 py-8">Loading...</div>;
  }

  if (!job) {
    return <div className="max-w-4xl mx-auto px-4 py-8">Job not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-600 hover:underline flex items-center"
      >
        ← Back to search results
      </button>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
            <div className="text-lg text-gray-600">
              {job.company} • {job.location}
            </div>
          </div>
          {matchPercentage !== null && (
            <div className="bg-green-100 text-green-800 rounded-full px-4 py-2 text-lg font-semibold">
              {matchPercentage}% Match
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Salary</div>
            <div className="text-lg font-semibold text-green-600">{job.salary}</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Posted</div>
            <div className="text-lg font-semibold">{job.postedTime}</div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Job Description</h2>
          <div className="prose max-w-none">
            {job.description.split('\n').map((paragraph, index) => (
              paragraph.trim() && (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              )
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Requirements</h2>
          <ul className="list-disc pl-5 space-y-2">
            {job.requirements?.map((requirement, index) => (
              <li key={index} className="text-gray-700">{requirement}</li>
            ))}
          </ul>
        </div>

        <div className="flex justify-center">
          <button 
            onClick={() => window.open(job.applyUrl, '_blank')}
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobDetailPage;