import { create } from 'zustand';
import api from '../services/api';
interface Task {
  id: string;
  title: string;
  description: string;
  progress: number;
  projectName: string;
  dueDate: string;
  status: string;
  // Add other task properties as needed
}

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  loading: boolean;
  loadingCurrentTask: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  fetchTaskById: (id: string) => Promise<void>;
  updateTaskStatus: (id: string, status: number, updateNote?: string) => Promise<void>;
}

// ... (imports and interface definitions remain the same)

const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  currentTask: null,
  loading: false,
  loadingCurrentTask: false,
  error: null,
  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/tasks/my-tasks');
      set({ tasks: response.data as Task[], loading: false });
    } catch (e) {
      console.error('Failed to fetch tasks:', e);
      set({ error: 'Failed to fetch tasks', loading: false });
    }
  },
  fetchTaskById: async (id: string) => {
    set({ loadingCurrentTask: true, error: null });
    try {
      const response = await api.get(`/task/${id}`);
      set({ currentTask: response.data as Task, loadingCurrentTask: false });
    } catch (e) {
      console.error(`Failed to fetch task ${id}:`, e);
      set({ error: `Failed to fetch task ${id}`, loadingCurrentTask: false });
    }
  },
  updateTaskStatus: async (id: string, status: number, updateNote?: string) => {
    try {
      const response = await api.patch(`/tasks/${id}/progress`, { progress_percentage: status, update_note: updateNote });
      const updatedTask = response.data as Task;

      set((state) => ({
        currentTask: updatedTask,
        tasks: state.tasks.map(task =>
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

