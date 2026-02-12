import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import useAuthStore from '@/src/context/AuthStore';
import ActionBar from '@/components/ui/action-bar';
import Button from '@/components/ui/button';
import api from '../services/api';

const UpdateProfileScreen = ({ navigation }) => {
  const { user, updateUser } = useAuthStore();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpdate = async () => {
    try {
      const response = await api.put('/users/update-me', { full_name: fullName, email });
      const updatedUser = response.data;
      // The updateUser function updates the user in the store
      updateUser(updatedUser);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile.');
      console.error(err);
    }
  };

  return (
    <>
      <ActionBar title="Update Profile" />
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          {success ? <Text style={styles.success}>{success}</Text> : null}
          <Button title="Update" onPress={handleUpdate} />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
      },
      content: {
        flex: 1,
        marginTop: 12,
      },
      card: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
      },
      label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
      },
      input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 8,
        marginBottom: 16,
        fontSize: 16,
      },
      error: {
        color: 'red',
        marginBottom: 16,
      },
      success: {
        color: 'green',
        marginBottom: 16,
      },
});

export default UpdateProfileScreen;
