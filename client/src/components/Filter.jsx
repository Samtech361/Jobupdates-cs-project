import React from 'react';
import { X } from 'lucide-react';

const Filter = ({ jobType, location, datePost, onFilterChange, isMobileFilterOpen, setIsMobileFilterOpen }) => {
  const FilterContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center lg:hidden">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button 
          onClick={() => setIsMobileFilterOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Date Posted</h3>
        <select
          value={datePost}
          onChange={(e) => onFilterChange('datePost', e.target.value)}
          className="w-full rounded-lg border-gray-200 text-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="anytime">Anytime</option>
          <option value="last24hours">Last 24 hours</option>
          <option value="last7days">Last 7 days</option>
          <option value="last30days">Last 30 days</option>
        </select>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Job Type</h3>
        <div className="space-y-3">
          {["Full-time", "Part-time", "Freelance", "Internship", "Volunteer"].map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="checkbox"
                checked={jobType.includes(type)}
                onChange={() => {
                  const updatedTypes = jobType.includes(type)
                    ? jobType.filter(t => t !== type)
                    : [...jobType, type];
                  onFilterChange('jobType', updatedTypes);
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-sm text-gray-600">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Location Type</h3>
        <div className="space-y-3">
          {["On-site", "Remote", "Hybrid"].map((loc) => (
            <label key={loc} className="flex items-center">
              <input
                type="radio"
                value={loc}
                checked={location === loc}
                onChange={() => onFilterChange('location', loc)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-3 text-sm text-gray-600">{loc}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={() => onFilterChange('clearAll')}
        className="w-full py-2 text-sm text-red-600 hover:text-red-700 font-medium"
      >
        Clear all filters
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Filter */}
      <div className="hidden lg:block w-72 flex-none">
        <div className="sticky top-4 bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <FilterContent />
        </div>
      </div>

      {/* Mobile Filter */}
      <div className={`
        fixed inset-0 z-40 lg:hidden transform transition-transform duration-300
        ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full'}
      `}> 
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileFilterOpen(false)} />
        <div className="relative w-full max-w-xs bg-white h-full p-6 overflow-y-auto">
          <FilterContent />
        </div>
      </div>
    </>
  );
};

export default Filter;