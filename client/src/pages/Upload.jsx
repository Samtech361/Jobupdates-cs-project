

const Upload = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex space-x-4">
          <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center">1</div>
          <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center">2</div>
          <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center">3</div>
        </div>
        <button className="text-gray-600 hover:text-gray-800">Cancel</button>
      </div>

      <h2 className="text-2xl font-bold mb-6">Create or import a custom classification</h2>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        {/* <Upload className="mx-auto mb-4 text-gray-400" size={48} /> */}
        <p className="text-lg font-semibold mb-2">Create or import a custom classification</p>
        <p className="text-sm text-gray-600 mb-4">Maximum file size: 50 MB<br />Supported format: .CSV</p>
        <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300">
          Choose file
        </button>
      </div>

      <div className="mt-8">
        <h3 className="font-semibold mb-2">Template file to download</h3>
        <div className="bg-gray-100 rounded-md p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-md flex items-center justify-center mr-4">
              <span className="text-green-600 font-semibold">XL</span>
            </div>
            <div>
              <p className="font-semibold">classification_v3</p>
              <p className="text-sm text-gray-600">XLSX • 1.2 MB</p>
            </div>
          </div>
          <div className="w-24 bg-blue-600 h-1 rounded-full"></div>
        </div>
      </div>

      <div className="mt-4">
        <div className="bg-gray-100 rounded-md p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-md flex items-center justify-center mr-4">
              <span className="text-green-600 font-semibold">XL</span>
            </div>
            <div>
              <p className="font-semibold">Template Classification</p>
              <p className="text-sm text-gray-600">XLSX • 4.49 KB</p>
            </div>
          </div>
          <button className="text-green-600 hover:text-green-700">Download</button>
        </div>
      </div>

      <div className="mt-8">
        <button className="flex items-center text-gray-600 hover:text-gray-800">
          {/* <X size={20} className="mr-2" /> */}
          How to create a custom classification
        </button>
      </div>
    </div>
  );
};

export default Upload;