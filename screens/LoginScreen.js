import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../styles/globalStyles';
import { foodAPI } from '../services/api'; 
import { useAuth } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  // const validateEmail = (email) => {
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   return emailRegex.test(email);
  // };

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your username/email');
      return;
    }

    // if (!password.trim()) {
    //   Alert.alert('Error', 'Please enter your password');
    //   return;
    // }

    // if (password.length < 6) {
    //   Alert.alert('Error', 'Password must be at least 6 characters long');
    //   return;
    // }

    setIsLoading(true);

    try {
      console.log("Calling Login API");
      // Use your loginUser function instead of foodAPI.login
      const response = await foodAPI.loginUser(email, password);
      const data = response.data;
      console.log('Login response:', response.data);
      
      if (data.status) {
        // Store token and user info in AsyncStorage
    await AsyncStorage.setItem('userId', data.userId);
    await AsyncStorage.setItem('userInfo', JSON.stringify({
      userName: email,
      loginTime: new Date().toISOString()
    }));

    console.log('Login successful:', data);
        
        // Since your API doesn't return userId, we'll use the username as identifier
        // You might want to modify your API to return userId for better user management
        await AsyncStorage.setItem('userId', data.userId);

        console.log('Login successful for user:', email);
        
        // Navigate to HomeScreen with userId (using email as identifier)
        login(data.userId, email);


      } else {
        // Handle login failure
        Alert.alert('Login Failed', response.message || 'Invalid credentials');
      }

    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', 'Network error or server unavailable');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!email.trim()) {
      Alert.alert('Forgot Password', 'Please enter your username/email first.');
      return;
    }

    Alert.alert(
      'Forgot Password',
      `Password reset instructions will be sent to ${email}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send Reset Instructions', 
          onPress: () => {
            // Implement password reset API call here
            console.log('Password reset requested for:', email);
          }
        }
      ]
    );
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  const handleGoogleLogin = async () => {
    // Implement Google login functionality
    Alert.alert(
      'Google Login',
      'Google authentication would be implemented here.',
      [{ text: 'OK' }]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Sign in to continue ordering</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username/Email</Text>
            <TextInput
              style={[styles.input, !email.trim() && styles.inputError]}
              placeholder="Enter your username or email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.passwordContainer, !password.trim() && styles.inputError]}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
              <TouchableOpacity
                style={styles.showPasswordButton}
                onPress={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                <Text style={styles.showPasswordText}>
                  {showPassword ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.forgotPasswordButton}
            onPress={handleForgotPassword}
            disabled={isLoading}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.disabledButton]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={styles.loadingText}>Signing in...</Text>
              </View>
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity 
            style={styles.googleButton}
            onPress={handleGoogleLogin}
            disabled={isLoading}
          >
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleSignUp} disabled={isLoading}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  header: { alignItems: 'center', marginBottom: 40 },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary || '#FF6B6B',
    marginBottom: 8,
  },
  subtitle: { fontSize: 16, color: colors.gray || '#666' },
  form: { width: '100%' },
  inputContainer: { marginBottom: 20 },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  inputError: {
    borderColor: '#FF6B6B',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  showPasswordButton: { paddingHorizontal: 16, paddingVertical: 12 },
  showPasswordText: {
    color: colors.primary || '#FF6B6B',
    fontWeight: '600',
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: colors.primary || '#FF6B6B',
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: colors.primary || '#FF6B6B',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: { opacity: 0.6 },
  loginButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 16,
    color: colors.gray || '#666',
    fontWeight: '600',
  },
  googleButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 30,
  },
  googleButtonText: { color: '#333', fontSize: 16, fontWeight: '600' },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: { color: colors.gray || '#666', fontSize: 16 },
  signupLink: {
    color: colors.primary || '#FF6B6B',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;