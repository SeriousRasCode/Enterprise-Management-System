import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TaskDetailScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task Detail</Text>
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
  },
});

export default TaskDetailScreen;
