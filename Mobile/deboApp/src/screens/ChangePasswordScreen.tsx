import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import ActionBar from '@/components/ui/action-bar';
import Button from '@/components/ui/button';
import api from '../services/api';

const ChangePasswordScreen = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChangePassword = async () => {
    try {
      await api.put('/users/me/password', { currentPassword, newPassword });
      setSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError('Failed to change password.');
      console.error(err);
    }
  };

  return (
    <>
      <ActionBar title="Change Password" />
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.label}>Current Password</Text>
          <TextInput
            style={styles.input}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
          />
          <Text style={styles.label}>New Password</Text>
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          {success ? <Text style={styles.success}>{success}</Text> : null}
          <Button title="Change Password" onPress={handleChangePassword} />
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

export default ChangePasswordScreen;
