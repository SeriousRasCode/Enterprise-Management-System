import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';

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
        <View style={styles.cardRow}>
          <IconSymbol name="clipboard.fill" size={24} color={Colors.light.tint} />
          <View style={styles.cardContent}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.metaRow}>
              <IconSymbol name="folder.fill" size={14} color={Colors.light.icon} />
              <Text style={styles.projectName}>{projectName}</Text>
            </View>
            <View style={styles.metaRow}>
              <IconSymbol name="calendar" size={14} color={Colors.light.icon} />
              <Text style={styles.dueDate}>Due: {dueDate}</Text>
            </View>
            <Text style={styles.status}>Status:</Text>
            <View style={styles.statusBar}>
              <View style={[styles.statusFill, { width: `${status}%` }]} />
            </View>
          </View>
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
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  projectName: {
    fontSize: 14,
    color: 'gray',
    marginLeft: 4,
  },
  dueDate: {
    fontSize: 12,
    color: 'gray',
    marginLeft: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
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
