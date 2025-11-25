import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import authUtils from './utils/authUtils';

// Pages
import Login from './pages/Login';
import EmployeeHome from './pages/EmployeeHome';
import Profile from './pages/Profile';
import Dashboard from './pages/admin/Dashboard';
import RegisterEmployee from './pages/admin/RegisterEmployee';
import UserManagement from './pages/admin/UserManagement';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const isAuthenticated = authUtils.isAuthenticated();
  const isAdmin = authUtils.isAdmin();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const isAuthenticated = authUtils.isAuthenticated();
  const isAdmin = authUtils.isAdmin();

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? '/admin/dashboard' : '/home'} replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Employee Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <EmployeeHome />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute adminOnly>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/register-employee"
          element={
            <ProtectedRoute adminOnly>
              <RegisterEmployee />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute adminOnly>
              <UserManagement />
            </ProtectedRoute>
          }
        />

        {/* Shared Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;