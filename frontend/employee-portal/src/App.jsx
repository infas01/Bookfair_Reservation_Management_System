import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import EmployeeAuth from './pages/EmployeeAuth';
import authUtils from './utils/authUtils';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authUtils.isAuthenticated();
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const Home = () => {
  const user = authUtils.getUser();

  const handleLogout = () => {
    const refreshToken = authUtils.getRefreshToken();
    authUtils.clearAuth();
    window.location.href = '/auth';
  };

  return (
    <div className="min-h-screen bg-secondary-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-4">
            Welcome to Employee Portal
          </h1>
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
            <p className="text-secondary-700">
              <span className="font-semibold">Name:</span> {user?.name}
            </p>
            <p className="text-secondary-700">
              <span className="font-semibold">Email:</span> {user?.email}
            </p>
            <p className="text-secondary-700">
              <span className="font-semibold">Role:</span> {user?.role}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<EmployeeAuth />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
}

export default App;
