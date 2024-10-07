

const Upload = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
      <h2 className="text-2xl font-bold mb-6">Upload Resume</h2>

        <button className="text-gray-600 hover:text-gray-800">Cancel</button>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <p className="text-lg font-semibold mb-2">Upload resume</p>
        <p className="text-sm text-gray-600 mb-4">Maximum file size: 10 MB<br />Supported format: .PDF or .DOCS</p>
        <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300">
          Choose file
        </button>
      </div>
    </div>
  );
};

export default Upload;