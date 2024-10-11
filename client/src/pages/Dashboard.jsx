import React, { useEffect, useState } from 'react'
import Filter from '../components/Filter';
import axios from '../components/axios';

function Dashboard() {
  const [query, setQuery] = useState('');
  const [jobListings, setJobListing] = useState([])
  const [filteredJobListings, setFilteredJobListings] = useState([]);
  const [isLoading, setIsLoading] = useState(false)

  //state for filters
  const [jobType, setJobType] = useState([]);
  const [location, setLocation] = useState("");
  const [datePost, setDatePost] = useState("anytime");

  useEffect(()=>{
    applyFilters();
  }, [jobListings, jobType, location, datePost])

  const JobListing = ({ title, company, location, description, salary, postedTime }) => (
    <div className="border-b border-gray-200 py-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="flex items-center text-sm text-gray-600 mt-1">
        <span>{company}</span>
        <span className="mx-2">•</span>
        <span>{location}</span>
      </div>
      <p className="mt-2 text-sm text-gray-700">{description}</p>
      <div className="mt-2 flex items-center text-sm">
        <span className="text-green-600 font-semibold">{salary}</span>
        <span className="ml-auto text-gray-500">Posted {postedTime}</span>
      </div>
    </div>
  );

  const HandleSearch = async (e) => {
    e.preventDefault();

    setIsLoading(true)
    try {
      const results = await axios.post('/jobsearch',
        { query },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      )

      setJobListing(results.data)
      .then(setQuery(""))
      setIsLoading(false)
      
    } catch (error) {
      setIsLoading(false)
    }
  }

  const applyFilters = ()=>{
    let filtered = [...jobListings]

    if(jobType.length > 0){ //filter by jobtype
      filtered = filtered.filter(job => jobType.includes(job.type));
    }

    if(location){ //filter by location
      filtered = filtered.filter(job => jobType.location === location)
    }

    if(datePost !== "anytime"){
      const now = new Date(); 
      filtered = filtered.filter(job=>{
        const postedDate = new Date(job.postedTime)
        const diffTime = Math.abs(now - postedDate)
        const diffDays = Math.ceil(diffTime/(1000*60*60*24))

        switch(datePost){
          case "last24hours":
            return diffDays <= 1

          case "last7days":
            return diffDays <= 7;
          
          case "last30days":
            return diffDays <= 30
          
          default:
            return true
        }
      })
    }
  }
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Find your dream job</h1>
      <p className="mb-6 text-gray-600">Looking for jobs? Browse our latest job openings to view & apply to the best jobs today!</p>

      <form className="flex mb-6" onSubmit={HandleSearch} id='search_form'>
        <div className="flex-grow mr-4">
          <div className="relative ">
            <input
              type="text"
              placeholder="Search job title or keyword"
              className="w-full pl-10 pr-4 py-2 border rounded-md"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
              }}
              required
            />

          </div>
        </div>
        {/* <input
          type="text"
          placeholder="Country or timezone"
          className="w-1/3 px-4 py-2 border rounded-md"
        /> */}
        <button className="ml-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300">
          Find jobs
        </button>
      </form>

      <div className="flex">
        <div className="w-1/4 pr-6">
          <Filter />
        </div>
        <div className="w-3/4">
          <p className="text-gray-600 mb-4">{jobListings.length} Jobs results</p>
          {
            isLoading ? (
              <p>Loading...</p>
            ) : jobListings && jobListings.length > 0 ? (
              <div>
                {jobListings.map((job, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-200"
                  >
                    <div className="flex justify-between items-center">
                      <JobListing
                        title={job.title}
                        company={job.company}
                        location={job.location}
                        description={job.description}
                        salary={job.salary}
                        postedTime={job.postedTime}
                      />
                    </div>

                  </div>
                ))}
              </div>

            ) : (
              <p>No jobs found</p>
            )
          }


        </div>
      </div>
    </div>
  )
}

export default Dashboard