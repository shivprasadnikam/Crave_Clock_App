import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { globalStyles, colors } from '../styles/globalStyles';
import { useAuth } from '../context/AuthContext';
import { foodAPI } from '../services/api';

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const userId = user?.id;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const res = await foodAPI.getUserProfile(userId);
        setProfile(res.data);
      } catch (err) {
        Alert.alert('Error', 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleUpdateProfile = async () => {
    if (!profile) return;
    setUpdating(true);
    try {
      await foodAPI.updateUserProfile(userId, profile);
      Alert.alert('Profile Updated', 'Your profile has been updated successfully!');
    } catch (err) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: logout,
      },
    ]);
  };

  if (loading) {
    return (
      <View style={[globalStyles.container, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={[globalStyles.container, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Profile not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={globalStyles.container}>
      <View style={styles.container}>
        <Text style={globalStyles.title}>Profile</Text>

        <View style={styles.section}>
          <Text style={globalStyles.subtitle}>Personal Information</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="Full Name"
            value={profile.name || ''}
            onChangeText={name => setProfile({ ...profile, name })}
          />
          <TextInput
            style={globalStyles.input}
            placeholder="Email"
            value={profile.email || ''}
            editable={false}
            keyboardType="email-address"
          />
          <TextInput
            style={globalStyles.input}
            placeholder="Phone Number"
            value={profile.phone || ''}
            onChangeText={phone => setProfile({ ...profile, phone })}
            keyboardType="phone-pad"
          />
          <TextInput
            style={globalStyles.input}
            placeholder="Address"
            value={profile.address || ''}
            onChangeText={address => setProfile({ ...profile, address })}
            multiline
          />
        </View>

        <TouchableOpacity style={globalStyles.button} onPress={handleUpdateProfile} disabled={updating}>
          <Text style={globalStyles.buttonText}>{updating ? 'Updating...' : 'Update Profile'}</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={globalStyles.subtitle}>App Settings</Text>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Notifications</Text>
            <Text style={styles.settingValue}>On</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Payment Methods</Text>
            <Text style={styles.settingValue}></Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Order History</Text>
            <Text style={styles.settingValue}></Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[globalStyles.button, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Text style={globalStyles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingText: {
    fontSize: 16,
    color: colors.black,
  },
  settingValue: {
    fontSize: 16,
    color: colors.gray,
  },
  logoutButton: {
    backgroundColor: colors.error,
    marginTop: 32,
  },
});

export default ProfileScreen;
