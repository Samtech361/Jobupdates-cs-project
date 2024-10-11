import React from "react";

const FilterComponent = ({ jobType, salaryRange, location, datePost, onFilterChange }) => {
  const handleJobTypeChange = (type) => {
    const updatedJobType = jobType.includes(type)
      ? jobType.filter((item) => item !== type)
      : [...jobType, type];
    onFilterChange('jobType', updatedJobType);
  };

  const handleClearAll = () => {
    onFilterChange('clearAll')
  }

  return (
    <div className="p-4 rounded-lg shadow-md max-w-xs ml-4 w-[20vw] max-h-auto mb-3">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Filter</h2>
        <button onClick={handleClearAll} className="text-red-500 underline">
          Clear all
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Date Post</label>
        <select
          value={datePost}
          onChange={(e) => onFilterChange('datePost', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="anytime">Anytime</option>
          <option value="last24hours">Last 24 hours</option>
          <option value="last7days">Last 7 days</option>
          <option value="last30days">Last 30 days</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Job type</label>
        <div className="mt-2 space-y-2">
          {[
            "Full-time",
            "Part-time",
            "Freelance",
            "Internship",
            "Volunteer",
          ].map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="checkbox"
                value={type}
                checked={jobType.includes(type)}
                onChange={() => handleJobTypeChange(type)}
                className="h-4 w-4 text-green-600 border-gray-300 rounded"
              />
              <span className="ml-2">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">On-site/remote</label>
        <div className="mt-2 space-y-2">
          {["On-site", "Remote", "Hybrid"].map((loc) => (
            <label key={loc} className="flex items-center">
              <input
                type="radio"
                value={loc}
                checked={location === loc}
                onChange={() => onFilterChange('location', loc)}
                className="h-4 w-4 text-green-600 border-gray-300"
              />
              <span className="ml-2">{loc}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterComponent;
