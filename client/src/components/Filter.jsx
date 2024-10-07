const FilterSection = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="font-semibold mb-2">{title}</h3>
    {children}
  </div>
);

const Checkbox = ({ label }) => (
  <div className="flex items-center mb-2">
    <input type="checkbox" className="form-checkbox h-4 w-4 text-green-600" />
    <span className="ml-2 text-sm">{label}</span>
  </div>
);

const Filter = () => {
  return (
    <div>
      <FilterSection title="Date Posted">
        <Checkbox label="Anytime" />
        <Checkbox label="Last day" />
        <Checkbox label="Last 3 days" />
        <Checkbox label="Last week" />
      </FilterSection>

      <FilterSection title="Job type">
        <Checkbox label="Full-time" />
        <Checkbox label="Part-time" />
        <Checkbox label="Internship" />
        <Checkbox label="Freelance" />
        <Checkbox label="Volunteer" />
      </FilterSection>

      <FilterSection title="On-site/remote">
        <Checkbox label="On-site" />
        <Checkbox label="Hybrid" />
        <Checkbox label="Remote" />
      </FilterSection>

    </div>
  );
};

export default Filter;