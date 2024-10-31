import React, { useEffect, useState } from 'react';
import axios from '../components/axios';
import { User, Mail, Settings, Bell, FileText, Upload, Eye, Loader } from 'lucide-react';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please Log In to Continue');
        setLoading(false);
        return;
      }

      const response = await axios.get('/api/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Profile response:', response.data); // Debug log
      setUser(response.data);
      setResume(response.data.resumeUrl);
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true);
      setError(null);
      const formData = new FormData();
      formData.append('resume', file);

      try {
        const token = localStorage.getItem('token');
        const response = await axios.post('/api/profile/resume', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
        setResume(response.data.resumeUrl);
        console.log(response.data.resumeUrl)
        await fetchUserProfile();
      } catch (err) {
        setError('Failed to upload resume');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleViewResume = () => {
    if (resume) {
      window.open(resume, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="h-8 w-8 text-green-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-green-800 text-white p-6">
        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-full bg-green-600 flex items-center justify-center text-3xl font-bold mx-auto mb-4">
            {user?.username ? user.username.substring(0, 2).toUpperCase() : '??'}
          </div>
          <h2 className="text-xl font-semibold">{user?.username || 'Loading...'}</h2>
          <p className="text-sm text-green-300">{user?.email || 'Loading...'}</p>
        </div>
        <nav>
          <a href="#" className="flex items-center py-2 px-4 text-green-300 hover:bg-green-700 rounded">
            <User className="mr-3" size={18} />
            Profile
          </a>
          <a href="#" className="flex items-center py-2 px-4 text-green-300 hover:bg-green-700 rounded">
            <Settings className="mr-3" size={18} />
            Settings
          </a>
          <a href="#" className="flex items-center py-2 px-4 text-green-300 hover:bg-green-700 rounded">
            <Bell className="mr-3" size={18} />
            Notifications
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Profile Overview */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Profile Overview</h3>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Username</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user?.username || 'Not set'}</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Email address</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user?.email || 'Not set'}</dd>
                </div>
                {/* <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Job title</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user?.jobTitle || 'Not set'}</dd>
                </div> */}
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Resume</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {loading ? (
                      <div className="flex items-center">
                        <Loader className="h-5 w-5 text-green-600 animate-spin mr-2" />
                        <span>Uploading...</span>
                      </div>
                    ) : resume ? (
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-green-600 mr-2" />
                        <span className="mr-2">Resume uploaded</span>
                        <button
                          onClick={handleViewResume}
                          className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded text-xs inline-flex items-center"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <label htmlFor="resume-upload" className="cursor-pointer bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded inline-flex items-center">
                          <Upload className="h-5 w-5 mr-2" />
                          <span>Upload Resume</span>
                        </label>
                        <input
                          id="resume-upload"
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                          onChange={handleResumeUpload}
                        />
                      </div>
                    )}
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
            </div>
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {user?.recentActivity?.length > 0 ? (
                  user.recentActivity.map((activity, index) => (
                    <li key={index} className="px-4 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <FileText className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {activity.action}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(activity.date).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-4 text-gray-500">No recent activity</li>
                )}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserProfile;