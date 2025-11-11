import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import authService from '../services/authService';
import authUtils from '../utils/authUtils';
import { BookOpen, CheckCircle, XCircle } from 'lucide-react';

const EmployeeAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
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
      const response = await authService.login(
        formData.email,
        formData.password
      );

      authUtils.setTokens(response.accessToken, response.refreshToken);
      authUtils.setUser(response.user);

      showNotification('Login successful! Redirecting...', 'success');

      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      showNotification(
        typeof error === 'string' ? error : 'Invalid email or password',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (formData) => {
    setLoading(true);
    try {
      const response = await authService.register(formData);

      authUtils.setTokens(response.accessToken, response.refreshToken);
      authUtils.setUser(response.user);

      showNotification(
        'Account created successfully! Redirecting...',
        'success'
      );

      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      showNotification(
        typeof error === 'string'
          ? error
          : 'Registration failed. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg transition-all ${
            notification.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <XCircle className="h-5 w-5" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
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
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="mt-2 text-sm text-secondary-600">
            {isLogin
              ? 'Sign in to your employee account'
              : 'Join our bookfair management system'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="flex mb-8 bg-secondary-100 rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                isLogin
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-secondary-600 hover:text-secondary-900'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                !isLogin
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-secondary-600 hover:text-secondary-900'
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="transition-all duration-300">
            {isLogin ? (
              <LoginForm onSubmit={handleLogin} loading={loading} />
            ) : (
              <SignupForm onSubmit={handleSignup} loading={loading} />
            )}
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-secondary-600">
              {isLogin
                ? "Don't have an account? "
                : 'Already have an account? '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-secondary-500">
          © 2025 Bookfair Reservation System. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default EmployeeAuth;
