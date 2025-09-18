/**
 * Global Debug Commands for Browser Console
 * Usage: Open browser console and type: window.debugAuth()
 */

import { logAuthStatus, checkAuthStatus, clearAuthData, refreshAuthFromStorage } from './auth-debug';

export const setupGlobalDebug = () => {
  // Make debug functions available globally
  (window as any).debugAuth = () => {
    console.log('🔧 BandBoost Debug Tools');
    console.log('Available commands:');
    console.log('- debugAuth() - Show this help');
    console.log('- checkAuth() - Check authentication status');
    console.log('- clearAuth() - Clear authentication data');
    console.log('- refreshAuth() - Refresh authentication');
    console.log('- testAPI() - Test API connection');
    
    return logAuthStatus('Manual Debug Check');
  };

  (window as any).checkAuth = () => {
    return logAuthStatus('Manual Auth Check');
  };

  (window as any).clearAuth = () => {
    clearAuthData();
    console.log('🔄 Please refresh the page or login again');
  };

  (window as any).refreshAuth = () => {
    return refreshAuthFromStorage();
  };

  (window as any).testAPI = async () => {
    console.log('🧪 Testing API connection...');
    
    const authInfo = checkAuthStatus();
    console.log('Auth Status:', authInfo);
    
    if (!authInfo.isAuthenticated) {
      console.error('❌ Cannot test API - not authenticated');
      return false;
    }
    
    try {
      // Test a simple API call
      const response = await fetch('http://localhost:5000/api/writing/scores', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('API Response Status:', response.status);
      console.log('API Response OK:', response.ok);
      
      if (response.ok) {
        console.log('✅ API connection successful');
        return true;
      } else {
        console.error('❌ API error:', response.status, response.statusText);
        return false;
      }
    } catch (error) {
      console.error('❌ API connection failed:', error);
      return false;
    }
  };

  // Log that debug tools are available
  console.log('🔧 BandBoost Debug Tools loaded. Type debugAuth() for help.');
};