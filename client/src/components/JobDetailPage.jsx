import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building2, MapPin, Clock, Briefcase, ExternalLink, DollarSign } from 'lucide-react';
import axios from '../components/axios';
import JobMatchScore from './JobMatchScore';
import ResumeRecommendations from './ResumeRecommendations';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const searchQuery = localStorage.getItem('lastSearchQuery');
        const response = await axios.get(`/api/jobs/${id}`, {
          params: { searchQuery },
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        });
        setJob(response.data);
      } catch (error) {
        console.error('Error fetching job details:', error);
        setError(error.response?.data?.message || 'Failed to fetch job details');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  const JobHighlight = ({ icon: Icon, value }) => {
    if (!value || value === 'Not specified') return null;
    return (
      <div className="flex items-center gap-2 text-gray-600">
        <Icon className="h-4 w-4" />
        <span>{value}</span>
      </div>
    );
  };

  //loading animation
  const SkeletonLoader = () => (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="animate-pulse grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="lg:col-span-8">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
        </div>
      </div>
    </div>
  );

  const formatJobDescription = (description) => {
    if (!description) return [];
    const sections = description.split(/\n\n+/);
    return sections.map((section, index) => {
      const trimmedSection = section.trim();
      if (!trimmedSection) return null;
      
      if (trimmedSection.includes('\n•') || trimmedSection.includes('\n-')) {
        const [listTitle, ...items] = trimmedSection.split(/\n[•-] /);
        return (
          <div key={index} className="mb-6">
            {listTitle && <h3 className="font-semibold mb-2">{listTitle.trim()}</h3>}
            <ul className="list-disc pl-5 space-y-2">
              {items.map((item, i) => (
                <li key={i} className="text-gray-700">{item.trim()}</li>
              ))}
            </ul>
          </div>
        );
      }
      
      return (
        <p key={index} className="mb-4 text-gray-700">
          {trimmedSection}
        </p>
      );
    }).filter(Boolean);
  };

  if (isLoading) return <SkeletonLoader />;

  //error handler
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
              <button
                onClick={() => navigate(-1)}
                className="mt-4 text-sm font-medium text-red-800 hover:underline"
              >
                ← Back to search results
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-900">Job Not Found</h2>
        <p className="mt-2 text-gray-600">The job you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-blue-600 hover:underline"
        >
          ← Back to search results
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-600 hover:underline flex items-center"
      >
        ← Back to search results
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Match Score */}
        <div className="lg:col-span-4 space-y-6">
          {job.matchScore && <JobMatchScore matchScore={job.matchScore} />}
          {job && <ResumeRecommendations jobId={job.id} />}
        </div>

        {/* Right Column - Job Details */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Header Section */}
            <div className="border-b pb-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{job.title}</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <JobHighlight icon={Building2} label="Company" value={job.company} />
                <JobHighlight icon={MapPin} label="Location" value={job.location} />
                <JobHighlight icon={DollarSign} label="Salary" value={job.salary} />
                <JobHighlight icon={Clock} label="Posted" value={job.postedTime} />
                <JobHighlight icon={Briefcase} label="Job Type" value={job.type} />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <a
                href={job.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Quick Apply
                <ExternalLink className="h-4 w-4" />
              </a>
              <button 
                className="flex items-center justify-center border border-blue-600 text-blue-600 px-6 py-2.5 rounded-lg hover:bg-blue-50 transition-colors"
                onClick={() => window.print()}
              >
                Save Job
              </button>
            </div>

            {/* Job Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Job Description</h2>
              <div className="prose max-w-none">
                {formatJobDescription(job.description)}
              </div>
            </div>

            {/* Requirements Section */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Requirements</h2>
                <ul className="list-disc pl-5 space-y-2">
                  {job.requirements.map((requirement, index) => (
                    <li key={index} className="text-gray-700">{requirement}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;