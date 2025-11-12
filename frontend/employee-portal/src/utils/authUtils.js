export const authUtils = {
  setTokens: (accessToken, refreshToken) => {
    sessionStorage.setItem('accessToken', accessToken);
    sessionStorage.setItem('refreshToken', refreshToken);
  },

  getAccessToken: () => {
    return sessionStorage.getItem('accessToken');
  },

  getRefreshToken: () => {
    return sessionStorage.getItem('refreshToken');
  },

  setUser: (user) => {
    sessionStorage.setItem('user', JSON.stringify(user));
  },

  getUser: () => {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  clearAuth: () => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('user');
  },

  isAuthenticated: () => {
    return !!sessionStorage.getItem('accessToken');
  },

  hasRole: (role) => {
    const user = authUtils.getUser();
    return user?.role === role;
  },

  isAdmin: () => {
    return authUtils.hasRole('ADMIN');
  },

  isEmployee: () => {
    return authUtils.hasRole('EMPLOYEE');
  },
};

export default authUtils;
