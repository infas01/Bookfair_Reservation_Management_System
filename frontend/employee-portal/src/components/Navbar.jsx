import { useState, useRef, useEffect } from 'react';
import { BookOpen, User, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import authUtils from '../utils/authUtils';
import authService from '../services/authService';

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const user = authUtils.getUser();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const refreshToken = authUtils.getRefreshToken();
    if (refreshToken) {
      await authService.logout(refreshToken);
    }
    authUtils.clearAuth();
    navigate('/login');
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800';
      case 'EMPLOYEE':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-secondary-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-600 p-2 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-secondary-900">
                Bookfair Management
              </h1>
              <p className="text-xs text-secondary-500">
                {user?.role === 'ADMIN' ? 'Admin Portal' : 'Employee Portal'}
              </p>
            </div>
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-secondary-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-secondary-900">
                    {user?.name}
                  </p>
                  <span
                    className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${getRoleBadgeColor(
                      user?.role
                    )}`}
                  >
                    {user?.role}
                  </span>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary-600" />
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-secondary-400 transition-transform ${
                    isProfileOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-secondary-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-secondary-200">
                  <p className="text-sm font-medium text-secondary-900">
                    {user?.name}
                  </p>
                  <p className="text-xs text-secondary-500 mt-0.5">
                    {user?.email}
                  </p>
                  {user?.phone && (
                    <p className="text-xs text-secondary-500 mt-0.5">
                      {user?.phone}
                    </p>
                  )}
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate('/profile');
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors"
                  >
                    <User className="h-4 w-4 mr-3" />
                    View Profile
                  </button>
                </div>

                <div className="border-t border-secondary-200 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
