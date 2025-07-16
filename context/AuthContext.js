import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const userData = await AsyncStorage.getItem('userData');
      
      if (userToken) {
        setIsLoggedIn(true);
        if (userData) {
          setUser(JSON.parse(userData));
        }
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userId, email) => {
  try {
    const userData = {
      email,
      name: email.split('@')[0],
      id: userId, // ✅ Use the actual userId from the API response
    };

    await AsyncStorage.setItem('userToken', 'demo-token');
    await AsyncStorage.setItem('userData', JSON.stringify(userData));

    setUser(userData);
    setIsLoggedIn(true);

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Login failed' };
  }
};


 const signup = async (name, email, password) => {
  try {
    // Simulate API call (replace this with your real API call)
    const response = await foodAPI.signupUser(name, email, password);
    const data = response.data;

    if (!data || !data.userId) {
      throw new Error('Invalid signup response');
    }

    const userData = {
      name,
      email,
      id: data.userId, // ✅ Use real userId from your API
    };

    await AsyncStorage.setItem('userToken', 'demo-token');
    await AsyncStorage.setItem('userData', JSON.stringify(userData));

    setUser(userData);
    setIsLoggedIn(true);

    return { success: true };
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, error: 'Signup failed' };
  }
};


const logout = async () => {
  try {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    setUser(null);
    setIsLoggedIn(false); // ✅ Triggers navigation switch in AppNavigator
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

  const value = {
    isLoggedIn,
    isLoading,
    user,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};