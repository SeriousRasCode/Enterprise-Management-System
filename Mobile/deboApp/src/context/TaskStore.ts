import { create } from 'zustand';
import api from '../services/api';

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
      set({ tasks: response.data.data as Task[], loading: false });
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
  updateTaskStatus: async (id: string, status: number) => {
    try {
      const response = await api.patch(`/task/${id}/progress`, { progress: status });
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

