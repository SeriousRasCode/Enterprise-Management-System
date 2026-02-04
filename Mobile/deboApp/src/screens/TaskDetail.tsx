import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
import Slider from '@react-native-community/slider';
import useTaskStore from '@/src/context/TaskStore';

interface TaskDetailScreenProps {
  taskId: string;
}

const TaskDetailScreen: React.FC<TaskDetailScreenProps> = ({ taskId }) => {
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
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !currentTask) {
    return (
      <View style={styles.centered}>
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
    <View style={styles.container}>
      <Text style={styles.title}>{currentTask.title}</Text>
      <Text style={styles.projectName}>{currentTask.projectName}</Text>
      <Text style={styles.dueDate}>Due: {currentTask.dueDate}</Text>

      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>Status: {Math.round(status)}%</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={status}
          onValueChange={handleStatusChange}
          onSlidingComplete={saveStatus}
        />
        <View style={styles.buttonsContainer}>
          <Button title="Started" onPress={() => updateTaskStatus(taskId, 50)} />
          <Button title="Completed" onPress={() => updateTaskStatus(taskId, 100)} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  projectName: {
    fontSize: 16,
    color: 'gray',
    marginTop: 8,
  },
  dueDate: {
    fontSize: 14,
    color: 'gray',
    marginTop: 8,
  },
  statusContainer: {
    marginTop: 32,
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
    marginTop: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
});

export default TaskDetailScreen;
