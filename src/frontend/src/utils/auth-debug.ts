/**
 * Authentication Debug Utilities
 */

export interface AuthDebugInfo {
    isAuthenticated: boolean;
    hasToken: boolean;
    tokenLength?: number;
    hasUser: boolean;
    userInfo?: any;
    tokenPreview?: string;
    issues: string[];
  }
  
  export const checkAuthStatus = (): AuthDebugInfo => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const issues: string[] = [];
  
    // Check token
    if (!token) {
      issues.push('No authentication token found');
    } else if (token.length < 10) {
      issues.push('Token appears to be invalid (too short)');
    }
  
    // Check user data
    let userInfo = null;
    if (!userStr) {
      issues.push('No user data found');
    } else {
      try {
        userInfo = JSON.parse(userStr);
        if (!userInfo.id) {
          issues.push('User data missing ID');
        }
      } catch (e) {
        issues.push('Invalid user data format');
      }
    }
  
    const debugInfo: AuthDebugInfo = {
      isAuthenticated: !!token && !!userStr,
      hasToken: !!token,
      tokenLength: token?.length,
      hasUser: !!userStr,
      userInfo,
      tokenPreview: token ? `${token.substring(0, 10)}...` : undefined,
      issues
    };
  
    return debugInfo;
  };
  
  export const logAuthStatus = (context: string = 'Auth Check') => {
    const authInfo = checkAuthStatus();
    
    console.group(`🔐 ${context}`);
    console.log('Status:', authInfo.isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated');
    console.log('Token:', authInfo.hasToken ? `✅ Present (${authInfo.tokenLength} chars)` : '❌ Missing');
    console.log('User Data:', authInfo.hasUser ? '✅ Present' : '❌ Missing');
    
    if (authInfo.tokenPreview) {
      console.log('Token Preview:', authInfo.tokenPreview);
    }
    
    if (authInfo.userInfo) {
      console.log('User Info:', {
        id: authInfo.userInfo.id,
        email: authInfo.userInfo.email,
        role: authInfo.userInfo.role,
        subscription: authInfo.userInfo.subscription
      });
    }
    
    if (authInfo.issues.length > 0) {
      console.warn('Issues found:');
      authInfo.issues.forEach(issue => console.warn(`- ${issue}`));
    }
    
    console.groupEnd();
    
    return authInfo;
  };
  
  export const clearAuthData = () => {
    console.log('🧹 Clearing authentication data...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('✅ Authentication data cleared');
  };
  
  export const refreshAuthFromStorage = () => {
    const authInfo = logAuthStatus('Refresh Auth Check');
    return authInfo.isAuthenticated;
  };