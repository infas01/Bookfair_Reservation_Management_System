import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Calendar,
  CheckCircle,
  ArrowRight,
  Building,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import authUtils from '../utils/authUtils';
import reservationService from '../services/reservationService';

const Home = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const user = authUtils.getUser();
  const navigate = useNavigate();

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const data = await reservationService.getMyReservations();
      setReservations(data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      // Don't show error on home page, just use empty array
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const getReservationStats = () => {
    const total = reservations.length;
    const confirmed = reservations.filter(
      (r) => r.status === 'CONFIRMED'
    ).length;
    const pending = reservations.filter((r) => r.status === 'PENDING').length;
    const available = 3 - total; // Max 3 reservations per business

    return { total, confirmed, pending, available };
  };

  const stats = getReservationStats();

  const quickActions = [
    {
      title: 'Reserve Stalls',
      description: 'Browse and reserve available stalls',
      icon: BookOpen,
      color: 'bg-blue-500',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600',
      action: () => navigate('/stalls'),
    },
    {
      title: 'My Reservations',
      description: 'View and manage your reservations',
      icon: Calendar,
      color: 'bg-green-500',
      bgLight: 'bg-green-50',
      textColor: 'text-green-600',
      action: () => navigate('/reservations'),
    },
    {
      title: 'Literary Genres',
      description: 'Add genres you will be displaying',
      icon: TrendingUp,
      color: 'bg-purple-500',
      bgLight: 'bg-purple-50',
      textColor: 'text-purple-600',
      action: () => navigate('/genres'),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {notification && (
        <Toast
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-xl shadow-lg p-8 text-white mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-blue-100 mb-4">
                Colombo International Bookfair 2025
              </p>
              <div className="flex items-center space-x-4 text-sm">
                {user?.businessName && (
                  <div className="flex items-center bg-white/20 rounded-lg px-3 py-1">
                    <Building className="h-4 w-4 mr-2" />
                    {user.businessName}
                  </div>
                )}
                <div className="flex items-center bg-white/20 rounded-lg px-3 py-1">
                  <MapPin className="h-4 w-4 mr-2" />
                  Colombo, Sri Lanka
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <BookOpen className="h-24 w-24 text-white/30" />
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Reservations</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Confirmed</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.confirmed}
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.pending}
                </p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <Calendar className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Available Slots</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.available}
                </p>
                <p className="text-xs text-gray-500 mt-1">Out of 3 max</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all transform hover:-translate-y-1 text-left"
              >
                <div
                  className={`${action.bgLight} p-4 rounded-lg inline-block mb-4`}
                >
                  <action.icon className={`h-8 w-8 ${action.textColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {action.description}
                </p>
                <div className="flex items-center text-primary-600 font-medium text-sm">
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-2" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Reservations */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-12">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          </div>
        ) : reservations.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Recent Reservations
              </h2>
              <button
                onClick={() => navigate('/reservations')}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View All →
              </button>
            </div>
            <div className="space-y-3">
              {reservations.slice(0, 3).map((reservation) => (
                <div
                  key={reservation.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary-50 p-3 rounded-lg">
                      <BookOpen className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Stall {reservation.stallName || reservation.stallId}
                      </p>
                      <p className="text-sm text-gray-600">
                        Reserved on{' '}
                        {new Date(
                          reservation.reservationDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      reservation.status === 'CONFIRMED'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {reservation.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Reservations Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start by reserving stalls for the bookfair
            </p>
            <button
              onClick={() => navigate('/stalls')}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Browse Available Stalls
            </button>
          </div>
        )}

        {/* Important Information */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Important Information
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>
                You can reserve a maximum of <strong>3 stalls</strong> per
                business
              </span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>
                After reservation, you will receive an email with a{' '}
                <strong>QR code</strong> for entry
              </span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>
                Please add your <strong>literary genres</strong> to help
                visitors find your stall
              </span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>
                Event Date: <strong>March 15-20, 2025</strong> at BMICH, Colombo
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
