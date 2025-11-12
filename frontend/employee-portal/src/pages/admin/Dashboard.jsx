import { useState, useEffect } from 'react';
import { Users, UserCheck, Shield, TrendingUp, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Toast from '../../components/Toast';
import adminService from '../../services/adminService';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await adminService.getUserStats();
      setStats(data);
    } catch (error) {
      showNotification('Failed to load statistics', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const statsCards = stats
    ? [
        {
          title: 'Total Users',
          value: stats.totalUsers || 0,
          icon: Users,
          color: 'bg-blue-500',
          bgLight: 'bg-blue-100',
        },
        {
          title: 'Publishers',
          value: stats.users || 0,
          icon: TrendingUp,
          color: 'bg-green-500',
          bgLight: 'bg-green-100',
        },
        {
          title: 'Employees',
          value: stats.employees || 0,
          icon: UserCheck,
          color: 'bg-purple-500',
          bgLight: 'bg-purple-100',
        },
        {
          title: 'Admins',
          value: stats.admins || 0,
          icon: Shield,
          color: 'bg-orange-500',
          bgLight: 'bg-orange-100',
        },
      ]
    : [];

  const quickActions = [
    {
      title: 'Register Employee',
      description: 'Add a new employee to the system',
      icon: Plus,
      color: 'bg-primary-600',
      action: () => navigate('/admin/register-employee'),
    },
    {
      title: 'Manage Users',
      description: 'View and manage all users',
      icon: Users,
      color: 'bg-green-600',
      action: () => navigate('/admin/users'),
    },
    {
      title: 'View Employees',
      description: 'Browse all employee accounts',
      icon: UserCheck,
      color: 'bg-purple-600',
      action: () => navigate('/admin/users?role=EMPLOYEE'),
    },
  ];

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
          <h1 className="text-3xl font-bold text-secondary-900">
            Admin Dashboard
          </h1>
          <p className="text-secondary-600 mt-2">
            Manage users, employees, and system settings
          </p>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statsCards.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-secondary-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-secondary-900 mt-2">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`${stat.bgLight} p-4 rounded-lg`}>
                      <stat.icon
                        className={`h-8 w-8 ${stat.color.replace(
                          'bg-',
                          'text-'
                        )}`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold text-secondary-900 mb-6">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="flex items-start p-6 rounded-lg border-2 border-secondary-200 hover:border-primary-500 hover:shadow-md transition-all text-left"
                  >
                    <div className={`${action.color} p-3 rounded-lg mr-4`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary-900 mb-1">
                        {action.title}
                      </h3>
                      <p className="text-sm text-secondary-600">
                        {action.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
