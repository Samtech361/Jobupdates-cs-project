import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Filter from '../components/Filter';
import axios from '../components/axios';
import { SearchIcon, MapPinIcon, BuildingIcon, Calendar, SlidersHorizontal } from 'lucide-react';


const JobCard = ({ job, onClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 250;
  
  const displayDescription = isExpanded
    ? job.description
    : `${job.description?.slice(0, maxLength)}${job.description?.length > maxLength ? '...' : ''}`;


  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 group cursor-pointer"
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-grow">
          <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {job.title}
          </h2>
          <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
            <div className="flex items-center">
              <BuildingIcon size={16} className="mr-1.5 text-gray-400" />
              {job.company}
            </div>
            <div className="flex items-center">
              <MapPinIcon size={16} className="mr-1.5 text-gray-400" />
              {job.location}
            </div>
            <div className="flex items-center">
              <Calendar size={16} className="mr-1.5 text-gray-400" />
              {job.postedTime}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {job.type && (
          <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
            {job.type}
          </span>
        )}
        {job.locationType && (
          <span className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
            {job.locationType}
          </span>
        )}
        {job.salary && (
          <span className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-medium">
            {job.salary}
          </span>
        )}
      </div>

      <div className="mt-4 text-gray-600 text-sm">
        <div className="prose prose-sm max-w-none">
          {displayDescription}
        </div>
        {job.description?.length > maxLength && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="text-blue-600 hover:text-blue-800 mt-2 text-sm font-medium"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
    </div>
  );
};


const JobListings = () => {
  const navigate = useNavigate();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [jobListings, setJobListings] = useState(() => {
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
  }, [jobListings, jobType, salaryRange, location, datePost, sortOrder]);

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find your dream job
          </h1>
          <p className="text-lg text-gray-600">
            Browse through thousands of full-time and part-time jobs near you
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="relative mb-8">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search job title, keywords, or company"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            required
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search Jobs'}
          </button>
        </form>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex gap-8">
          {/* Filters */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-4">
              <Filter
                jobType={jobType}
                salaryRange={salaryRange}
                location={location}
                datePost={datePost}
                onFilterChange={handleFilterChange}
                isMobileFilterOpen={isMobileFilterOpen}
                setIsMobileFilterOpen={setIsMobileFilterOpen}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <SlidersHorizontal size={20} />
                  <span>Filters</span>
                </button>
                <p className="text-gray-600">
                  <span className="font-medium">{filteredJobListings.length}</span> jobs found
                </p>
              </div>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
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
                filteredJobListings.map((job) => (
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
    </div>
  );
};

export default JobListings;