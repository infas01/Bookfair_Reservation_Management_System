import { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import profileService from '../services/profileService';
import authUtils from '../utils/authUtils';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();
  const user = authUtils.getUser();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await profileService.getProfile();
      setProfile(data);
    } catch (error) {
      showNotification('Failed to load profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRoleBadge = (role) => {
    const styles = {
      ADMIN: 'bg-purple-100 text-purple-800 border-purple-200',
      EMPLOYEE: 'bg-blue-100 text-blue-800 border-blue-200',
      USER: 'bg-green-100 text-green-800 border-green-200',
    };
    return styles[role] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <Navbar />

      {notification && (
        <Toast
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(user?.role === 'ADMIN' ? '/admin/dashboard' : '/home')}
            className="flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-secondary-900">My Profile</h1>
          <p className="text-secondary-600 mt-2">View your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-12">
            <div className="flex items-center">
              <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center">
                <span className="text-4xl font-bold text-primary-600">
                  {profile?.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-6 text-white">
                <h2 className="text-2xl font-bold">{profile?.name}</h2>
                <span
                  className={`inline-block mt-2 px-3 py-1 text-sm font-semibold rounded-full border ${getRoleBadge(
                    profile?.role
                  )}`}
                >
                  {profile?.role}
                </span>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="flex items-start space-x-3">
                <div className="bg-primary-100 p-2 rounded-lg">
                  <Mail className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Email Address</p>
                  <p className="font-medium text-secondary-900">{profile?.email}</p>
                </div>
              </div>

              {/* Phone */}
              {profile?.phone && (
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-secondary-500">Phone Number</p>
                    <p className="font-medium text-secondary-900">{profile?.phone}</p>
                  </div>
                </div>
              )}

              {/* Business Name */}
              {profile?.businessName && (
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <User className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-secondary-500">Business Name</p>
                    <p className="font-medium text-secondary-900">
                      {profile?.businessName}
                    </p>
                  </div>
                </div>
              )}

              {/* Role */}
              <div className="flex items-start space-x-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Shield className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Role</p>
                  <p className="font-medium text-secondary-900">{profile?.role}</p>
                </div>
              </div>

              {/* Created At */}
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Member Since</p>
                  <p className="font-medium text-secondary-900">
                    {formatDate(profile?.createdAt)}
                  </p>
                </div>
              </div>

              {/* Updated At */}
              <div className="flex items-start space-x-3">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <Calendar className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Last Updated</p>
                  <p className="font-medium text-secondary-900">
                    {formatDate(profile?.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;