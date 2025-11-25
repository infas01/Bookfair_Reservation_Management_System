import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import LoginForm from '../components/LoginForm';
import Toast from '../components/Toast';
import authService from '../services/authService';
import authUtils from '../utils/authUtils';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleLogin = async (formData) => {
    setLoading(true);
    try {
      console.log('Attempting login with:', formData.email);

      const response = await authService.login(
        formData.email,
        formData.password
      );

      console.log('Login successful, response:', response);

      // Validate response
      if (!response.accessToken) {
        throw new Error('Invalid response: missing access token');
      }

      // Store tokens and user info
      authUtils.setTokens(response.accessToken, response.refreshToken);
      authUtils.setUser(response.user);

      showNotification('Login successful! Redirecting...', 'success');

      // Redirect based on role
      setTimeout(() => {
        if (authUtils.isAdmin()) {
          navigate('/admin/dashboard');
        } else {
          navigate('/home');
        }
      }, 1000);
    } catch (error) {
      console.error('Login failed:', error);

      let errorMessage = 'Invalid email or password';

      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {notification && (
        <Toast
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-primary-600 p-3 rounded-full">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-secondary-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-secondary-600">
            Sign in to access your portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-xl p-8">
          <LoginForm onSubmit={handleLogin} loading={loading} />
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-secondary-500">
          © 2025 Bookfair Reservation System. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
