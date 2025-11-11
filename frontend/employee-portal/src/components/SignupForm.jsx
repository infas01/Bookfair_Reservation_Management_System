import { useState } from 'react';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Building,
  AlertCircle,
  Check,
} from 'lucide-react';

const SignupForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const getPasswordStrength = (password) => {
    if (password.length === 0) return { strength: 0, label: '', color: '' };
    if (password.length < 6)
      return { strength: 1, label: 'Weak', color: 'bg-red-500' };
    if (password.length < 10)
      return { strength: 2, label: 'Medium', color: 'bg-yellow-500' };
    if (
      password.length >= 10 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password)
    ) {
      return { strength: 3, label: 'Strong', color: 'bg-green-500' };
    }
    return { strength: 2, label: 'Medium', color: 'bg-yellow-500' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const { confirmPassword, acceptTerms, ...submitData } = formData;
      onSubmit(submitData);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name Field */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-secondary-700 mb-2"
        >
          Full Name *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-secondary-400" />
          </div>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`block w-full pl-10 pr-3 py-3 border ${
              errors.name ? 'border-red-500' : 'border-secondary-300'
            } rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all`}
            placeholder="Moh Infas"
          />
        </div>
        {errors.name && (
          <div className="flex items-center mt-1 text-red-500 text-sm">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.name}
          </div>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-secondary-700 mb-2"
        >
          Email Address *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-secondary-400" />
          </div>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`block w-full pl-10 pr-3 py-3 border ${
              errors.email ? 'border-red-500' : 'border-secondary-300'
            } rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all`}
            placeholder="you@example.com"
          />
        </div>
        {errors.email && (
          <div className="flex items-center mt-1 text-red-500 text-sm">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.email}
          </div>
        )}
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-secondary-700 mb-2"
        >
          Phone Number
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-secondary-400" />
          </div>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="block w-full pl-10 pr-3 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            placeholder="+94 70 000 0000"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="businessName"
          className="block text-sm font-medium text-secondary-700 mb-2"
        >
          Business Name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Building className="h-5 w-5 text-secondary-400" />
          </div>
          <input
            type="text"
            id="businessName"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            className="block w-full pl-10 pr-3 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            placeholder="Your Company Name"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-secondary-700 mb-2"
        >
          Password *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-secondary-400" />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`block w-full pl-10 pr-10 py-3 border ${
              errors.password ? 'border-red-500' : 'border-secondary-300'
            } rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all`}
            placeholder="Create a strong password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-secondary-400 hover:text-secondary-600" />
            ) : (
              <Eye className="h-5 w-5 text-secondary-400 hover:text-secondary-600" />
            )}
          </button>
        </div>
        {formData.password && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-secondary-600">Password strength:</span>
              <span
                className={`font-medium ${
                  passwordStrength.strength === 1
                    ? 'text-red-500'
                    : passwordStrength.strength === 2
                    ? 'text-yellow-500'
                    : 'text-green-500'
                }`}
              >
                {passwordStrength.label}
              </span>
            </div>
            <div className="w-full bg-secondary-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${passwordStrength.color}`}
                style={{ width: `${(passwordStrength.strength / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
        {errors.password && (
          <div className="flex items-center mt-1 text-red-500 text-sm">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.password}
          </div>
        )}
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-secondary-700 mb-2"
        >
          Confirm Password *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-secondary-400" />
          </div>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`block w-full pl-10 pr-10 py-3 border ${
              errors.confirmPassword ? 'border-red-500' : 'border-secondary-300'
            } rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all`}
            placeholder="Confirm your password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5 text-secondary-400 hover:text-secondary-600" />
            ) : (
              <Eye className="h-5 w-5 text-secondary-400 hover:text-secondary-600" />
            )}
          </button>
        </div>
        {formData.confirmPassword &&
          formData.password === formData.confirmPassword && (
            <div className="flex items-center mt-1 text-green-500 text-sm">
              <Check className="h-4 w-4 mr-1" />
              Passwords match
            </div>
          )}
        {errors.confirmPassword && (
          <div className="flex items-center mt-1 text-red-500 text-sm">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.confirmPassword}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {loading ? (
          <div className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Creating account...
          </div>
        ) : (
          'Create Account'
        )}
      </button>
    </form>
  );
};

export default SignupForm;
