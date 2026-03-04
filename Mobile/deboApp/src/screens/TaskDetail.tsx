import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import ActionBar, { ACTION_BAR_HEIGHT } from '@/components/ui/action-bar';
import { useRouter } from 'expo-router';
import Button from '@/components/ui/button';
import Slider from '@react-native-community/slider';
import useTaskStore from '@/src/context/TaskStore';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';

interface TaskDetailScreenProps {
  taskId: string;
}

const TaskDetailScreen: React.FC<TaskDetailScreenProps> = ({ taskId }) => {
  const router = useRouter();
  const {
    currentTask,
    loadingCurrentTask,
    fetchTaskById,
    updateTaskStatus,
    error,
  } = useTaskStore();

  const [status, setStatus] = useState(0);

  useEffect(() => {
    fetchTaskById(taskId);
  }, [taskId, fetchTaskById]);

  useEffect(() => {
    if (currentTask) {
      setStatus(currentTask.status);
    }
  }, [currentTask]);

  if (loadingCurrentTask) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !currentTask) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Task not found.</Text>
      </View>
    );
  }

  const handleStatusChange = (newStatus: number) => {
    setStatus(newStatus);
  };
  
  const saveStatus = () => {
    updateTaskStatus(taskId, status);
  }

  return (
    <>
      <ActionBar title={currentTask.title} showBack onBack={() => router.back()} />
      <View style={[styles.container, { paddingTop: ACTION_BAR_HEIGHT }]}>
      <View style={[styles.card]}>
        <Text style={styles.title}>{currentTask.title}</Text>
        <View style={styles.metaRow}>
          <IconSymbol name="folder.fill" size={18} color={Colors.light.tint} />
          <Text style={styles.projectName}>{currentTask.projectName}</Text>
        </View>
        {currentTask.description ? (
          <View style={styles.metaRow}>
            <IconSymbol name="info.circle" size={16} color={Colors.light.icon} />
            <Text style={styles.description}>{currentTask.description}</Text>
          </View>
        ) : null}
        <View style={styles.metaRow}>
          <IconSymbol name="calendar" size={16} color={Colors.light.icon}  />
          <Text style={styles.dueDate}>Due: {currentTask.dueDate}</Text>
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>Status: {Math.round(status)}%</Text>
          {/* horizontal progress bar */}
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${status}%` }]} />
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={status}
            minimumTrackTintColor={Colors.light.tint}
            maximumTrackTintColor="#ddd"
            thumbTintColor={Colors.light.tint}
            onValueChange={handleStatusChange}
            onSlidingComplete={saveStatus}
          />
          <View style={styles.buttonsContainer}>
            <Button title="Started" onPress={() => updateTaskStatus(taskId, 50)} style={{ flex: 1, marginRight: 8 }} />
            <Button title="Completed" onPress={() => updateTaskStatus(taskId, 100)} style={{ flex: 1, marginLeft: 8 }} />
          </View>
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
    backgroundColor: '#fff',
  },
  progressBarBackground: {
    height: 10,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginVertical: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.light.tint,
    borderRadius: 5,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  projectName: {
    fontSize: 16,
    color: 'gray',
    marginLeft: 4,
  },
  description: {
    fontSize: 14,
    color: 'gray',
    marginLeft: 4,
  },
  dueDate: {
    fontSize: 14,
    color: 'gray',
    marginLeft: 4,
    marginTop: 0,
  },
  statusContainer: {
    marginTop: 16,
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
});

export default TaskDetailScreen;
