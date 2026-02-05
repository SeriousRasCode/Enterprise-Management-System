import create from 'zustand';
import tasks from '../tasks.json';

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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ tasks: tasks as Task[], loading: false });
    } catch (e) {
      console.error('Failed to fetch tasks:', e);
      set({ error: 'Failed to fetch tasks', loading: false });
    }
  },
  fetchTaskById: async (id: string) => {
    set({ loadingCurrentTask: true, error: null });
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      const task = tasks.find(t => t.id === id);
      set({ currentTask: task as Task, loadingCurrentTask: false });
    } catch (e) {
      console.error(`Failed to fetch task ${id}:`, e);
      set({ error: `Failed to fetch task ${id}`, loadingCurrentTask: false });
    }
  },
  updateTaskStatus: async (id: string, status: number) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      const updatedTasks = tasks.map(task => 
        task.id === id ? { ...task, status } : task
      );
      const updatedTask = updatedTasks.find(t => t.id === id);

      set((state) => ({
        currentTask: updatedTask as Task,
        tasks: updatedTasks as Task[],
      }));
    } catch (e) {
      console.error(`Failed to update task ${id}:`, e);
      // Optionally set an error state
    }
  },
}));

export default useTaskStore;
