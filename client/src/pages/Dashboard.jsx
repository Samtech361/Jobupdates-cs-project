import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Filter from '../components/Filter';
import axios from '../components/axios';
import { SearchIcon, MapPinIcon, BuildingIcon, Calendar, SlidersHorizontal } from 'lucide-react';


// Helper function to format the description
const formatDescription = (text) => {
  if (!text) return '';
  return text
    .split('\n')
    .filter(para => para.trim().length > 0)
    .join('\n');
};

// Helper function for time ago
const getTimeAgo = (postedTime) => {
  if (!postedTime) return 'Recently';

  const now = new Date();
  const posted = new Date(postedTime);
  const diffInHours = Math.floor((now - posted) / (1000 * 60 * 60));

  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths}m ago`;
};

const JobCard = ({ job, onClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 250;
  const formattedDescription = formatDescription(job.description);
  const isLongDescription = formattedDescription.length > maxLength;

  const displayDescription = isExpanded
    ? formattedDescription
    : formattedDescription.slice(0, maxLength) + (isLongDescription ? '...' : '');

  const handleToggleDescription = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-grow">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {job.title}
          </h2>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <BuildingIcon size={16} className="mr-1" />
              {job.company}
            </div>
            <div className="flex items-center">
              <MapPinIcon size={16} className="mr-1" />
              {job.location}
            </div>
            <div className="flex items-center">
              <Calendar size={16} className="mr-1" />
              {getTimeAgo(job.postedTime)}
            </div>
          </div>
        </div>
        {job.matchPercentage && (
          <div className="ml-4">
            <div
              className="text-sm font-medium px-3 py-1 rounded-full"
              style={{
                backgroundColor: `rgba(34, 197, 94, ${job.matchPercentage / 100})`,
                color: job.matchPercentage > 50 ? 'white' : 'black'
              }}
            >
              {job.matchPercentage}% Match
            </div>
          </div>
        )}
      </div>

      {/* Job Type and Salary */}
      <div className="flex flex-wrap gap-3 mb-4">
        {job.type && (
          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
            {job.type}
          </span>
        )}
        {job.locationType && (
          <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
            {job.locationType}
          </span>
        )}
        {job.salary && (
          <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
            {job.salary}
          </span>
        )}
      </div>

      {/* Description */}
      <div className="text-gray-600 text-sm">
        <div className="whitespace-pre-line">
          {displayDescription}
        </div>
        {isLongDescription && (
          <button
            onClick={handleToggleDescription}
            className="text-blue-600 hover:text-blue-800 mt-2 text-sm font-medium"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

      {/* Requirements Preview */}
      {job.requirements && job.requirements.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Key Requirements:</h3>
          <ul className="list-disc list-inside text-sm text-gray-600">
            {job.requirements.slice(0, 3).map((req, index) => (
              <li key={index} className="truncate">{req}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

//sorting function
const sortJobs = (jobs, order) => {
  return [...jobs].sort((a, b) => {
    const dateA = new Date(a.postedTime).getTime() || 0;
    const dateB = new Date(b.postedTime).getTime() || 0;
    return order === 'newest' ? dateB - dateA : dateA - dateB;
  });
};

const JobListings = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [jobListings, setJobListings] = useState(() => {
    // Initialize from localStorage if available
    const saved = localStorage.getItem('jobListings');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('jobListings', JSON.stringify(jobListings));
  }, [jobListings]);

  const [filteredJobListings, setFilteredJobListings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest');

  // Filter states
  const [jobType, setJobType] = useState([]);
  const [salaryRange, setSalaryRange] = useState("");
  const [location, setLocation] = useState("");
  const [datePost, setDatePost] = useState("anytime");

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/jobsearch',
        { query },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      );

      localStorage.setItem('lastSearchQuery', query);

      const jobsWithTimestamp = response.data.map(job => ({
        ...job,
        timestamp: new Date(job.postedTime).getTime() || Date.now()
      }));

      setJobListings(jobsWithTimestamp);

      // Get match percentages
      // const jobsWithMatch = await Promise.all(
      //   response.data.map(async (job) => {
      //     try {
      //       const matchResponse = await axios.post('/api/match-percentage',
      //         { jobId: job.id },
      //         {
      //           headers: { "Content-Type": "application/json" },
      //           withCredentials: true
      //         }
      //       );
      //       return { ...job, matchPercentage: matchResponse.data.percentage };
      //     } catch (error) {
      //       console.error('Error fetching match percentage:', error);
      //       return { ...job, matchPercentage: null };
      //     }
      //   })
      // );

      // setJobListings(jobsWithMatch);
      setQuery("");
    } catch (error) {
      setError('Failed to fetch jobs. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...jobListings];

    // Filter by job type
    if (jobType.length > 0) {
      filtered = filtered.filter(job => jobType.includes(job.type));
    }

    // Filter by location type
    if (location) {
      filtered = filtered.filter(job => job.locationType === location);
    }

    // Filter by date posted
    if (datePost !== "anytime") {
      const now = new Date();
      filtered = filtered.filter(job => {
        const postedDate = new Date(job.postedTime);
        const diffTime = Math.abs(now - postedDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        switch (datePost) {
          case "last24hours":
            return diffDays <= 1;
          case "last7days":
            return diffDays <= 7;
          case "last30days":
            return diffDays <= 30;
          default:
            return true;
        }
      });
    }

    // Sort by match percentage if available
    filtered.sort((a, b) => {
      if (a.matchPercentage && b.matchPercentage) {
        return b.matchPercentage - a.matchPercentage;
      }
      return 0;
    });

    setFilteredJobListings(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [jobListings, jobType, salaryRange, location, datePost]);

  const handleFilterChange = (filterType, value) => {
    switch (filterType) {
      case 'jobType':
        setJobType(value);
        break;
      case 'salaryRange':
        setSalaryRange(value);
        break;
      case 'location':
        setLocation(value);
        break;
      case 'datePost':
        setDatePost(value);
        break;
      case 'clearAll':
        setJobType([]);
        setLocation('');
        setDatePost('anytime');
        break;
      default:
        break;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Find your dream job
        </h1>
        <p className="text-lg text-gray-600">
          Browse through thousands of full-time and part-time jobs near you
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4">
          <div className="flex-grow relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Job title, keywords, or company"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search Jobs'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="sticky top-4">
            <Filter
            jobType={jobType}
            salaryRange={salaryRange}
            location={location}
            datePost={datePost}
            onFilterChange={handleFilterChange}
          />
          </div>
          
        </div>

        {/* Job Listings */}
        <div className="flex-1 min-w-0">
          <div className="mb-4 flex justify-between items-center">
            <p className="text-gray-600">
              {filteredJobListings.length} jobs found
            </p>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border rounded-md px-3 py-1.5 text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Searching for jobs...</p>
              </div>
            ) : filteredJobListings.length > 0 ? (
              sortJobs(filteredJobListings, sortOrder).map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onClick={() => navigate(`/job/${job.id}`)}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No jobs found. Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobListings;