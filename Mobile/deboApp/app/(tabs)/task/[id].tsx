import TaskDetailScreen from '@/src/screens/TaskDetail';
import { useLocalSearchParams } from 'expo-router';

export default function TaskDetail() {
    const { id } = useLocalSearchParams();
    return <TaskDetailScreen taskId={id as string} />;
}