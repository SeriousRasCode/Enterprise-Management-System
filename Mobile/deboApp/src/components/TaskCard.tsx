import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

interface TaskCardProps {
  id: string;
  title: string;
  projectName: string;
  dueDate: string;
  status: number;
}

const TaskCard: React.FC<TaskCardProps> = ({ id, title, projectName, dueDate, status }) => {
  return (
    <Link href={`/(tabs)/task/${id}`} asChild>
      <TouchableOpacity style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.projectName}>{projectName}</Text>
        <Text style={styles.dueDate}>Due: {dueDate}</Text>
        <Text style={styles.status}>Status:</Text>
        <View style={styles.statusBar}>
            <View style={[styles.statusFill, { width: `${status}%` }]} />
        </View>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  projectName: {
    fontSize: 14,
    color: 'gray',
    marginTop: 4,
  },
  dueDate: {
    fontSize: 12,
    color: 'gray',
    marginTop: 8,
  },
  status: {
    fontSize: 12,
    color: 'green',
    marginTop: 8,
    fontWeight: 'bold',
  },
  statusBar: {
    height: 10,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginTop: 4,
  },
  statusFill: {
    height: '100%',
    backgroundColor: 'green',
    borderRadius: 5,
  },
});

export default TaskCard;
