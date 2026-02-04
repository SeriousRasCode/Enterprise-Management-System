import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import useAuthStore from '@/src/context/AuthStore';

const ProfileScreen = () => {
  const { user, logout } = useAuthStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {user && (
        <View style={styles.userInfoContainer}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.info}>{user.name}</Text>
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
