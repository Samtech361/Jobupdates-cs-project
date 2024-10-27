import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { User, LogOut, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const navLinkClasses = "px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 transition-colors duration-200";
  const activeNavLinkClasses = "text-green-600 border-b-2 border-green-600";

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-green-600 font-bold text-2xl">
                JobUpdates
              </Link>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-4 items-center">
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => 
                  `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`
                }
              >
                Find Jobs
              </NavLink>
              <NavLink 
                to="/talent" 
                className={({ isActive }) => 
                  `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`
                }
              >
                Find Talent
              </NavLink>
              <NavLink 
                to="/upload" 
                className={({ isActive }) => 
                  `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`
                }
              >
                Upload Job
              </NavLink>
              <NavLink 
                to="/about" 
                className={({ isActive }) => 
                  `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`
                }
              >
                About Us
              </NavLink>
            </div>
          </div>

          {/* Desktop Profile and Logout */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-green-600 focus:outline-none"
              >
                <User className="h-6 w-6" />
              </button>

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <span className="flex items-center">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-600 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink
              to="/dashboard"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50"
            >
              Find Jobs
            </NavLink>
            <NavLink
              to="/talent"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50"
            >
              Find Talent
            </NavLink>
            <NavLink
              to="/upload"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50"
            >
              Upload Job
            </NavLink>
            <NavLink
              to="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50"
            >
              About Us
            </NavLink>
            <NavLink
              to="/profile"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50"
            >
              Profile
            </NavLink>
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50"
            >
              <span className="flex items-center">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}