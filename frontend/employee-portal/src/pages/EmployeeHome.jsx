import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  RefreshCw,
  MapPin,
  DollarSign,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  QrCode,
  Building,
  Phone,
  Mail,
  Eye,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import authUtils from '../utils/authUtils';
import stallService from '../services/stallService';
import reservationService from '../services/reservationService';

const EmployeeHome = () => {
  const [stalls, setStalls] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [filteredStalls, setFilteredStalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sizeFilter, setSizeFilter] = useState('ALL');
  const [notification, setNotification] = useState(null);
  const [selectedStall, setSelectedStall] = useState(null);
  const user = authUtils.getUser();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterStalls();
  }, [stalls, searchTerm, statusFilter, sizeFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [stallsData, reservationsData] = await Promise.all([
        stallService.getAllStalls(),
        reservationService.getAllReservations(),
      ]);
      setStalls(stallsData);
      setReservations(reservationsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      showNotification('Failed to load data. Using sample data.', 'warning');
      loadSampleData();
    } finally {
      setLoading(false);
    }
  };

  const loadSampleData = () => {
    const sampleStalls = [
      {
        id: 1,
        name: 'A1',
        size: 'SMALL',
        location: 'Hall A - Section 1',
        dimensions: '2m x 2m',
        price: 500.0,
        isReserved: false,
      },
      {
        id: 2,
        name: 'A2',
        size: 'SMALL',
        location: 'Hall A - Section 1',
        dimensions: '2m x 2m',
        price: 500.0,
        isReserved: false,
      },
      {
        id: 3,
        name: 'A3',
        size: 'MEDIUM',
        location: 'Hall A - Section 2',
        dimensions: '3m x 3m',
        price: 800.0,
        isReserved: false,
      },
      {
        id: 4,
        name: 'A4',
        size: 'MEDIUM',
        location: 'Hall A - Section 2',
        dimensions: '3m x 3m',
        price: 800.0,
        isReserved: false,
      },
      {
        id: 5,
        name: 'A5',
        size: 'LARGE',
        location: 'Hall A - Section 3',
        dimensions: '4m x 4m',
        price: 1200.0,
        isReserved: false,
      },
      {
        id: 6,
        name: 'B1',
        size: 'SMALL',
        location: 'Hall B - Section 1',
        dimensions: '2m x 2m',
        price: 500.0,
        isReserved: false,
      },
      {
        id: 7,
        name: 'B2',
        size: 'MEDIUM',
        location: 'Hall B - Section 2',
        dimensions: '3m x 3m',
        price: 800.0,
        isReserved: false,
      },
      {
        id: 8,
        name: 'B3',
        size: 'LARGE',
        location: 'Hall B - Section 3',
        dimensions: '4m x 4m',
        price: 1200.0,
        isReserved: false,
      },
      {
        id: 9,
        name: 'C1',
        size: 'SMALL',
        location: 'Hall C - Section 1',
        dimensions: '2m x 2m',
        price: 500.0,
        isReserved: false,
      },
      {
        id: 10,
        name: 'C2',
        size: 'LARGE',
        location: 'Hall C - Section 2',
        dimensions: '4m x 4m',
        price: 1200.0,
        isReserved: false,
      },
    ];
    setStalls(sampleStalls);
    setReservations([]);
  };

  const filterStalls = () => {
    let filtered = stalls;

    // Status filter
    if (statusFilter === 'AVAILABLE') {
      filtered = filtered.filter((stall) => !stall.isReserved);
    } else if (statusFilter === 'RESERVED') {
      filtered = filtered.filter((stall) => stall.isReserved);
    }

    // Size filter
    if (sizeFilter !== 'ALL') {
      filtered = filtered.filter((stall) => stall.size === sizeFilter);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (stall) =>
          stall.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          stall.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredStalls(filtered);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const getStallReservation = (stallId) => {
    return reservations.find(
      (res) => res.stallId === stallId && res.status === 'CONFIRMED'
    );
  };

  const getSizeColor = (size) => {
    switch (size) {
      case 'SMALL':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LARGE':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStats = () => {
    const total = stalls.length;
    const reserved = stalls.filter((s) => s.isReserved).length;
    const available = total - reserved;
    const small = stalls.filter((s) => s.size === 'SMALL').length;
    const medium = stalls.filter((s) => s.size === 'MEDIUM').length;
    const large = stalls.filter((s) => s.size === 'LARGE').length;

    return { total, reserved, available, small, medium, large };
  };

  const stats = getStats();

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900">
                Stall Management
              </h1>
              <p className="text-secondary-600 mt-2">
                Colombo International Bookfair - Stall Availability &
                Reservations
              </p>
            </div>
            <button
              onClick={fetchData}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-secondary-600">Total Stalls</p>
            <p className="text-2xl font-bold text-secondary-900">
              {stats.total}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg shadow-sm p-4 border border-green-200">
            <p className="text-sm text-green-700">Available</p>
            <p className="text-2xl font-bold text-green-900">
              {stats.available}
            </p>
          </div>
          <div className="bg-red-50 rounded-lg shadow-sm p-4 border border-red-200">
            <p className="text-sm text-red-700">Reserved</p>
            <p className="text-2xl font-bold text-red-900">{stats.reserved}</p>
          </div>
          <div className="bg-blue-50 rounded-lg shadow-sm p-4 border border-blue-200">
            <p className="text-sm text-blue-700">Small</p>
            <p className="text-2xl font-bold text-blue-900">{stats.small}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow-sm p-4 border border-yellow-200">
            <p className="text-sm text-yellow-700">Medium</p>
            <p className="text-2xl font-bold text-yellow-900">{stats.medium}</p>
          </div>
          <div className="bg-purple-50 rounded-lg shadow-sm p-4 border border-purple-200">
            <p className="text-sm text-purple-700">Large</p>
            <p className="text-2xl font-bold text-purple-900">{stats.large}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
              <input
                type="text"
                placeholder="Search by stall name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="ALL">All Status</option>
                <option value="AVAILABLE">Available</option>
                <option value="RESERVED">Reserved</option>
              </select>
            </div>

            {/* Size Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
              <select
                value={sizeFilter}
                onChange={(e) => setSizeFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="ALL">All Sizes</option>
                <option value="SMALL">Small</option>
                <option value="MEDIUM">Medium</option>
                <option value="LARGE">Large</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-secondary-600">
            Showing {filteredStalls.length} of {stalls.length} stalls
          </p>
        </div>

        {/* Stalls Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredStalls.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-secondary-600">No stalls found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStalls.map((stall) => {
              const reservation = getStallReservation(stall.id);
              return (
                <div
                  key={stall.id}
                  className={`bg-white rounded-lg shadow-sm border-2 transition-all hover:shadow-md ${
                    stall.isReserved
                      ? 'border-red-200 bg-red-50'
                      : 'border-green-200 bg-green-50'
                  }`}
                >
                  <div className="p-4">
                    {/* Stall Header */}
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-secondary-900">
                          {stall.name}
                        </h3>
                        <span
                          className={`inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded-full border ${getSizeColor(
                            stall.size
                          )}`}
                        >
                          {stall.size}
                        </span>
                      </div>
                      <div className="flex items-center">
                        {stall.isReserved ? (
                          <XCircle className="h-6 w-6 text-red-600" />
                        ) : (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        )}
                      </div>
                    </div>

                    {/* Stall Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-secondary-700">
                        <MapPin className="h-4 w-4 mr-2 text-secondary-400" />
                        {stall.location}
                      </div>
                      <div className="flex items-center text-secondary-700">
                        <Building className="h-4 w-4 mr-2 text-secondary-400" />
                        {stall.dimensions}
                      </div>
                      <div className="flex items-center font-semibold text-primary-600">
                        <DollarSign className="h-4 w-4 mr-2" />
                        LKR {stall.price.toFixed(2)}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="mt-4">
                      <span
                        className={`inline-block w-full text-center px-3 py-2 rounded-lg font-semibold text-sm ${
                          stall.isReserved
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {stall.isReserved ? 'RESERVED' : 'AVAILABLE'}
                      </span>
                    </div>

                    {/* View Details Button */}
                    {stall.isReserved && (
                      <button
                        onClick={() => setSelectedStall({ stall, reservation })}
                        className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        View Reservation
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reservation Details Modal */}
      {selectedStall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-secondary-900">
                    Stall {selectedStall.stall.name}
                  </h3>
                  <p className="text-secondary-600 mt-1">Reservation Details</p>
                </div>
                <button
                  onClick={() => setSelectedStall(null)}
                  className="text-secondary-400 hover:text-secondary-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              {/* Stall Information */}
              <div className="bg-secondary-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-secondary-900 mb-3">
                  Stall Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-secondary-600">Size</p>
                    <p className="font-medium text-secondary-900">
                      {selectedStall.stall.size}
                    </p>
                  </div>
                  <div>
                    <p className="text-secondary-600">Dimensions</p>
                    <p className="font-medium text-secondary-900">
                      {selectedStall.stall.dimensions}
                    </p>
                  </div>
                  <div>
                    <p className="text-secondary-600">Location</p>
                    <p className="font-medium text-secondary-900">
                      {selectedStall.stall.location}
                    </p>
                  </div>
                  <div>
                    <p className="text-secondary-600">Price</p>
                    <p className="font-medium text-primary-600">
                      LKR {selectedStall.stall.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Reservation Information */}
              {selectedStall.reservation ? (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-secondary-900 mb-3 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Publisher Information
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-secondary-400" />
                      <span className="text-secondary-600">Name:</span>
                      <span className="ml-2 font-medium text-secondary-900">
                        {selectedStall.reservation.userName || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-secondary-400" />
                      <span className="text-secondary-600">Email:</span>
                      <span className="ml-2 font-medium text-secondary-900">
                        {selectedStall.reservation.userEmail || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-secondary-400" />
                      <span className="text-secondary-600">Phone:</span>
                      <span className="ml-2 font-medium text-secondary-900">
                        {selectedStall.reservation.userPhone || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-2 text-secondary-400" />
                      <span className="text-secondary-600">Business:</span>
                      <span className="ml-2 font-medium text-secondary-900">
                        {selectedStall.reservation.businessName || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-secondary-400" />
                      <span className="text-secondary-600">Reserved:</span>
                      <span className="ml-2 font-medium text-secondary-900">
                        {selectedStall.reservation.reservationDate
                          ? new Date(
                              selectedStall.reservation.reservationDate
                            ).toLocaleString()
                          : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <QrCode className="h-4 w-4 mr-2 text-secondary-400" />
                      <span className="text-secondary-600">QR Code:</span>
                      <span className="ml-2 font-mono text-xs font-medium text-secondary-900">
                        {selectedStall.reservation.qrCode || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <p className="text-yellow-800">
                    Reservation details not available
                  </p>
                </div>
              )}

              <div className="mt-6">
                <button
                  onClick={() => setSelectedStall(null)}
                  className="w-full px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeHome;
