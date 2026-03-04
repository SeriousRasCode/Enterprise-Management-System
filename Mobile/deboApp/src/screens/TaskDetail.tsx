import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import ActionBar, { ACTION_BAR_HEIGHT } from '@/components/ui/action-bar';
import { useRouter } from 'expo-router';
import Button from '@/components/ui/button';
import Slider from '@react-native-community/slider';
import useTaskStore from '@/src/context/TaskStore';
import useAuthStore from '@/src/context/AuthStore';
import { taskAPI } from '@/src/services/api';
import { IconSymbol } from '@/components/ui/icon-symbol';


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

  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const [isAssigned, setIsAssigned] = useState(false);
  const [status, setStatus] = useState(0);

  useEffect(() => {
    fetchTaskById(taskId);
  }, [taskId, fetchTaskById]);

  // when current task loads, check whether user is assigned
  useEffect(() => {
    if (currentTask) {
      setStatus(currentTask.status);
      taskAPI
        .getAssignments(Number(currentTask.id))
        .then((resp) => {
          const body: any = resp?.data;
          let arr: any[] = [];
          if (Array.isArray(body)) arr = body;
          else if (body && Array.isArray(body.data)) arr = body.data;
          const userId = useAuthStore.getState().user?.id;
          if (userId && arr.find((u) => String(u.id) === String(userId))) {
            setIsAssigned(true);
          } else {
            setIsAssigned(false);
          }
        })
        .catch(() => setIsAssigned(false));
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

  const saveStatus = async (newStatus?: number) => {
    // if user clicked a button, update the value accordingly
    const value = typeof newStatus === 'number' ? newStatus : status;
    if (!isAssigned) {
      Alert.alert('Update denied', 'You must be assigned to this task to change progress.');
      return;
    }
    try {
      await updateTaskStatus(taskId, value);
      setStatus(value);
    } catch (err: any) {
      // backend may still reject if race or stale assignment
      if (err.response && err.response.status === 403) {
        Alert.alert('Update denied', 'You must be assigned to this task to change progress.');
      } else {
        console.error(err);
      }
    }
  };

  
  return (
    <>
      <ActionBar title={currentTask.title} showBack onBack={() => router.back()} />
      <View
        style={[
          styles.container,
          { paddingTop: ACTION_BAR_HEIGHT, backgroundColor: colors.background },
        ]}>
        <View style={[styles.card, { backgroundColor: Colors[theme].card }]}>
        <Text style={styles.title}>{currentTask.title}</Text>
        <View style={styles.metaRow}>
          <IconSymbol name="folder.fill" size={18} color={colors.tint} />
          <Text style={[styles.projectName, { color: colors.text }]}>{currentTask.projectName}</Text>
        </View>
        {currentTask.description ? (
          <View style={styles.metaRow}>
            <IconSymbol name="info.circle" size={16} color={colors.icon} />
            <Text style={[styles.description, { color: colors.text }]}>{currentTask.description}</Text>
          </View>
        ) : null}
        <View style={styles.metaRow}>
          <IconSymbol name="calendar" size={16} color={colors.icon}  />
          <Text style={[styles.dueDate, { color: colors.text }]}>Due: {currentTask.dueDate}</Text>
        </View>

        <View style={styles.statusContainer}>
          <Text style={[styles.statusText, { color: colors.text }]}>Status: {Math.round(status)}%</Text>
          {/* horizontal progress bar */}
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${status}%`, backgroundColor: colors.tint },
              ]}
            />
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={status}
            minimumTrackTintColor={isAssigned ? colors.tint : '#999'}
            maximumTrackTintColor={colors.background}
            thumbTintColor={isAssigned ? colors.tint : '#999'}
            onValueChange={handleStatusChange}
            onSlidingComplete={() => saveStatus()}
            disabled={!isAssigned}
          />
          <View style={styles.buttonsContainer}>
            <Button title="Started" onPress={() => saveStatus(50)} style={{ flex: 1, marginRight: 8 }} />
            <Button title="Completed" onPress={() => saveStatus(100)} style={{ flex: 1, marginLeft: 8 }} />
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
    borderRadius: 5,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
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
