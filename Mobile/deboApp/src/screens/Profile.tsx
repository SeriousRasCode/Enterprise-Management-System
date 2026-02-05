import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import useAuthStore from '@/src/context/AuthStore';
import ActionBar from '@/components/ui/action-bar';
import Button from '@/components/ui/button';

const ProfileScreen = () => {
  const { user, logout } = useAuthStore();

  return (
    <View style={styles.container}>
      <ActionBar title="Profile" />
      {user && (
        <View style={styles.userInfoContainer}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.info}>{user.name}</Text>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.info}>{user.email}</Text>
          <Text style={styles.label}>Role:</Text>
          <Text style={styles.info}>{user.role}</Text>
          <Text style={styles.label}>Team:</Text>
          <Text style={styles.info}>{user.team}</Text>
        </View>
      )}
      <Button title="Logout" onPress={logout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  userInfoContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  info: {
    fontSize: 16,
    marginBottom: 12,
  },
});

export default ProfileScreen;
