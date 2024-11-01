import React, { useState, useEffect } from 'react';
import { X, Download, Printer } from 'lucide-react';

const ResumePreview = ({ resumeUrl, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Preload or validate the resume
    if (resumeUrl) {
      const img = new Image();
      img.onload = () => setLoading(false);
      img.onerror = () => {
        setError('Unable to load resume');
        setLoading(false);
      };
      img.src = resumeUrl;
    }
  }, [resumeUrl]);

  const handleDownload = () => {
    if (resumeUrl) {
      const link = document.createElement('a');
      link.href = resumeUrl;
      link.download = 'resume.pdf';
      link.click();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!resumeUrl) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg">
          <p className="text-red-500">No resume available</p>
          <button 
            onClick={onClose} 
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white w-11/12 max-w-4xl h-5/6 rounded-lg shadow-xl relative flex flex-col">
        {/* Header */}
        <div className="bg-green-700 text-white p-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-xl font-bold">Resume Preview</h2>
          <div className="flex space-x-2">
            <button 
              onClick={handleDownload}
              className="hover:bg-green-600 p-2 rounded"
              title="Download Resume"
            >
              <Download className="h-6 w-6" />
            </button>
            <button 
              onClick={handlePrint}
              className="hover:bg-green-600 p-2 rounded"
              title="Print Resume"
            >
              <Printer className="h-6 w-6" />
            </button>
            <button 
              onClick={onClose}
              className="hover:bg-red-600 p-2 rounded"
              title="Close Preview"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500">
              <p>{error}</p>
            </div>
          ) : (
            <iframe 
              src={resumeUrl} 
              width="100%" 
              height="100%" 
              className="border rounded"
              title="Resume Preview"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;