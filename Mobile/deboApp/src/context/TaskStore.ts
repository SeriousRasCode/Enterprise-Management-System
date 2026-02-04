import create from 'zustand';
import api from '../services/api';

interface Task {
  id: string;
  title: string;
  projectName: string;
  dueDate: string;
  status: number;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
}

const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  loading: false,
  error: null,
  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/tasks/assigned');
      // Assuming the tasks are in response.data.tasks
      // You might need to adjust this based on your API response
      set({ tasks: response.data.tasks || response.data, loading: false });
    } catch (e) {
      console.error('Failed to fetch tasks:', e);
      set({ error: 'Failed to fetch tasks', loading: false });
    }
  },
}));

export default useTaskStore;
