// Utility to clear authentication data and force fresh login
export const clearAuthenticationData = () => {
  console.log('Clearing authentication data...');
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
  localStorage.removeItem('currentUser');
  
  // Force page reload to reset authentication state
  window.location.reload();
};

// Function to check if current token is valid
export const checkTokenValidity = async () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    // Try to decode the token and check expiration
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    if (payload.exp < currentTime) {
      console.log('Token is expired, clearing auth data');
      clearAuthenticationData();
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error validating token:', error);
    clearAuthenticationData();
    return false;
  }
};