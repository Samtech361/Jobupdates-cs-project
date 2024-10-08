import React, { useState } from 'react'
import Filter from '../components/Filter';
import axios from '../components/axios';

function Dashboard() {
  const [query, setQuery] = useState('');

  const JobListing = ({ title, company, location, description, salary, postedTime }) => (
    <div className="border-b border-gray-200 py-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="flex items-center text-sm text-gray-600 mt-1">
        <span>{company}</span>
        <span className="mx-2">•</span>
        {/* <MapPin size={14} className="inline mr-1" /> */}
        <span>{location}</span>
      </div>
      <p className="mt-2 text-sm text-gray-700">{description}</p>
      <div className="mt-2 flex items-center text-sm">
        <span className="text-green-600 font-semibold">{salary}</span>
        <span className="ml-auto text-gray-500">Posted {postedTime}</span>
      </div>
    </div>
  );

  const HandleSearch = async(e) => {
    e.preventDefault();
    
    try {
      const results = await axios.post('/jobsearch',
        {query},
        {
          headers: {"Content-Type":"application/json"},
          withCredentials: true
        }
      )

      .then((results)=>{
        console.log(results.data.message)
      })
    } catch (error) {
      
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
              onChange={(e)=>{
                setQuery(e.target.value)
              }}
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
          <Filter/>
        </div>
        <div className="w-3/4">
          <p className="text-gray-600 mb-4">250 Jobs results</p>
          <JobListing
            title="Product Designer"
            company="Upscale Hiring"
            location="Marina East, Singapore"
            description="Within this role you will be creating content for a wide range of local and international clients. This role is suited to Bali based creatives looking to work in-house."
            salary="$8000-$12000"
            postedTime="5 mins ago"
          />
          <JobListing
            title="Copywriting Specialist"
            company="Odesma Studio"
            location="Paris, France"
            description="Collaborate with the marketing team to optimize conversion. Develop inspiring, persuasive, and convincing copy for a wide array of writing needs."
            salary="$4500-$6000 USD"
            postedTime="3 days ago"
          />
          <JobListing
            title="Full Stack Developer"
            company="Twitter"
            location="Málaga, Spain"
            description="Responsible for designing, planning, and testing of any projects/products. Building effective and reusable modules that will enhance user experience in each projects/products."
            salary="$7500-$9000 USD"
            postedTime="5 days ago"
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard