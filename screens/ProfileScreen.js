import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { globalStyles, colors } from '../styles/globalStyles';

const ProfileScreen = () => {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [phone, setPhone] = useState('+1 234 567 8900');
  const [address, setAddress] = useState('123 Main St, City, State 12345');

  const handleUpdateProfile = () => {
    Alert.alert('Profile Updated', 'Your profile has been updated successfully!');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => console.log('Logout') },
      ]
    );
  };

  return (
    <ScrollView style={globalStyles.container}>
      <View style={styles.container}>
        <Text style={globalStyles.title}>Profile</Text>
        
        <View style={styles.section}>
          <Text style={globalStyles.subtitle}>Personal Information</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={globalStyles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={globalStyles.input}
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <TextInput
            style={globalStyles.input}
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
            multiline
          />
        </View>

        <TouchableOpacity style={globalStyles.button} onPress={handleUpdateProfile}>
          <Text style={globalStyles.buttonText}>Update Profile</Text>
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