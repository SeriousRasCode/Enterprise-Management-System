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
  currentTask: Task | null;
  loading: boolean;
  loadingCurrentTask: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  fetchTaskById: (id: string) => Promise<void>;
  updateTaskStatus: (id: string, status: number) => Promise<void>;
}

const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  currentTask: null,
  loading: false,
  loadingCurrentTask: false,
  error: null,
  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/tasks/assigned');
      set({ tasks: response.data.tasks || response.data, loading: false });
    } catch (e) {
      console.error('Failed to fetch tasks:', e);
      set({ error: 'Failed to fetch tasks', loading: false });
    }
  },
  fetchTaskById: async (id: string) => {
    set({ loadingCurrentTask: true, error: null });
    try {
      const response = await api.get(`/tasks/${id}`);
      set({ currentTask: response.data, loadingCurrentTask: false });
    } catch (e) {
      console.error(`Failed to fetch task ${id}:`, e);
      set({ error: `Failed to fetch task ${id}`, loadingCurrentTask: false });
    }
  },
  updateTaskStatus: async (id: string, status: number) => {
    try {
      const response = await api.patch(`/tasks/${id}/update-status`, { status });
      const updatedTask = response.data;
      
      set((state) => ({
        currentTask: updatedTask,
        tasks: state.tasks.map((task) =>
          task.id === id ? updatedTask : task
        ),
      }));
    } catch (e) {
      console.error(`Failed to update task ${id}:`, e);
      // Optionally set an error state
    }
  },
}));

export default useTaskStore;
