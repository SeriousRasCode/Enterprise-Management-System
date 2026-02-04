import { useLocalSearchParams } from 'expo-router';
import TaskDetailScreen from '@/src/screens/TaskDetail';

export default function TaskDetail() {
  const { id } = useLocalSearchParams();
  // We can pass the id to the screen and fetch the task details there
  return <TaskDetailScreen taskId={id as string} />;
}
