import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import useAuthStore from '@/src/context/AuthStore';
import ActionBar, { ACTION_BAR_HEIGHT } from '@/components/ui/action-bar';
import Button from '@/components/ui/button';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuthStore();

  return (
    <>
      <ActionBar title="Profile" />
      <View style={[styles.container, { paddingTop: 0 }]}>
      <View style={styles.content}>
        {user ? (
          <View style={styles.card}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.info}>{user.full_name}</Text>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.info}>{user.email}</Text>
            <Text style={styles.label}>Role</Text>
            <Text style={styles.info}>{user.role}</Text>
            <Text style={styles.label}>Team</Text>
            <Text style={styles.info}>{user.team}</Text>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.info}>Not signed in</Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Button title="Update Profile" onPress={() => navigation.navigate('UpdateProfile')} />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Change Password" onPress={() => navigation.navigate('ChangePassword')} />
        </View>
        <View style={styles.logoutContainer}>
          <Button title="Logout" onPress={logout} />
        </View>
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
  buttonContainer: {
    marginBottom: 12,
  },
  logoutContainer: {
    marginTop: 12,
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
