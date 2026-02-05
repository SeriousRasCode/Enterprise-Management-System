import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import ActionBar, { ACTION_BAR_HEIGHT } from '@/components/ui/action-bar';
import { useRouter } from 'expo-router';
import Button from '@/components/ui/button';
import Slider from '@react-native-community/slider';
import useTaskStore from '@/src/context/TaskStore';

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
      <View style={[styles.container, { paddingTop: ACTION_BAR_HEIGHT  }]}>
      <View style={[styles.card]}>
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
    backgroundColor: '#f5f5f5',
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
  projectName: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 16,
  },
  dueDate: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 16,
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
