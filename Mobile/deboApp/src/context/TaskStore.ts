import { create } from 'zustand';
import api, { taskAPI, projectAPI } from '../services/api';
import useAuthStore from './AuthStore';
interface Task {
  id: string;
  title: string;
  description: string;
  progress: number;
  projectName: string;
  dueDate: string;
  status: number; // percentage value for progress bar
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
      // mimic web logic: fetch user's projects then tasks per project
      const projectsResponse = await projectAPI.getMyProjects();
      console.log('projectsResponse raw', projectsResponse);
      const body: any = projectsResponse?.data;
      let projectsList: any[] = [];
      if (body && body.success && Array.isArray(body.data)) {
        projectsList = body.data;
      } else if (Array.isArray(body)) {
        projectsList = body;
      } else if (body && Array.isArray(body.data)) {
        // fallback when response is {data: [...]}
        projectsList = body.data;
      }
      console.log('projectsList extracted', projectsList);

      const allTasksPromises = projectsList.map(async (proj) => {
        try {
          const resp = await taskAPI.getTasksByProject(proj.id);
          let projTasks: any[] = [];
          if (Array.isArray(resp)) {
            projTasks = resp;
          } else if (resp.data && Array.isArray(resp.data)) {
            projTasks = resp.data;
          }
          return projTasks.map((t) => ({
            id: String(t.id),
            title: t.title || t.name || '',
            description: t.description || '',
            progress: t.progress_percentage ?? t.progress ?? 0,
            projectName: proj.name,
            dueDate: t.due_date || t.dueDate || '',
            status: t.progress_percentage ?? t.progress ?? 0,
          }));
        } catch (err) {
          console.error(`error fetching tasks for project ${proj.id}`, err);
          return [];
        }
      });

      const nested = await Promise.all(allTasksPromises);
      const flat = nested.flat();
      set({ tasks: flat as Task[], loading: false });
    } catch (e) {
      console.error('Failed to fetch tasks:', e);
      set({ error: 'Failed to fetch tasks', loading: false });
    }
  },
  fetchTaskById: async (id: string) => {
    set({ loadingCurrentTask: true, error: null });
    try {
      // if we already have tasks loaded, use that first
      const existing = get().tasks.find((t) => t.id === id);
      if (existing) {
        set({ currentTask: existing, loadingCurrentTask: false });
        return;
      }
      // otherwise replicate fetchTasks logic but stop early when found
      const projectsResponse = await projectAPI.getMyProjects();
      const body: any = projectsResponse?.data;
      let projectsList: any[] = [];
      if (body && body.success && Array.isArray(body.data)) {
        projectsList = body.data;
      } else if (Array.isArray(body)) {
        projectsList = body;
      } else if (body && Array.isArray(body.data)) {
        projectsList = body.data;
      }

      for (const proj of projectsList) {
        try {
          const resp = await taskAPI.getTasksByProject(proj.id);
          let projTasks: any[] = [];
          if (Array.isArray(resp)) {
            projTasks = resp;
          } else if (resp.data && Array.isArray(resp.data)) {
            projTasks = resp.data;
          }
          const found = projTasks.find((t) => String(t.id) === id);
          if (found) {
            const taskObj: Task = {
              id: String(found.id),
              title: found.title || found.name || '',
              description: found.description || '',
              progress: found.progress_percentage ?? found.progress ?? 0,
              projectName: proj.name,
              dueDate: found.due_date || found.dueDate || '',
              status: found.progress_percentage ?? found.progress ?? 0,
            };
            set({ currentTask: taskObj, loadingCurrentTask: false });
            return;
          }
        } catch (err) {
          console.error(`error fetching tasks for project ${proj.id}`, err);
        }
      }
      set({
        currentTask: null,
        loadingCurrentTask: false,
        error: `Task ${id} not found`,
      });
    } catch (e) {
      console.error(`Failed to fetch task ${id}:`, e);
      set({ error: `Failed to fetch task ${id}`, loadingCurrentTask: false });
    }
  },
  updateTaskStatus: async (id: string, status: number, updateNote?: string) => {
    // ensure status is bounded
    const normalizedStatus = Math.min(Math.max(status, 0), 100);
    try {
      // make sure current user is assigned to this task before updating progress;
      // backend returns 403 if not assigned. Web UI likely handled it implicitly.
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        try {
          await taskAPI.assignTask(Number(id), Number(currentUser.id));
        } catch (assignErr: any) {
          // ignore duplicate assignment or other errors; 403 will be thrown later
          if (assignErr.response && assignErr.response.status !== 409) {
            console.warn('assignTask error', assignErr);
          }
        }
      }

      const response = await taskAPI.updateProgress(Number(id), {
        progress_percentage: normalizedStatus,
        update_note: updateNote || '',
      });

      if (!response || !response.data) {
        console.warn(`updateTaskStatus: response empty for task ${id}`);
        return;
      }

      // normalize returned object into our Task shape, similar to fetch logic
      const raw: any = response.data;
      const updatedTask: Task = {
        id: String(raw.id ?? id),
        title: raw.title || raw.name || '',
        description: raw.description || '',
        progress: raw.progress_percentage ?? raw.progress ?? normalizedStatus,
        projectName: raw.projectName || raw.project_name || '',
        dueDate: raw.due_date || raw.dueDate || '',
        status: raw.progress_percentage ?? raw.progress ?? normalizedStatus,
      };

      set((state) => {
        const mergedTasks = state.tasks.map((task) => {
          if (task.id !== id) return task;

          const merged: Task = {
            id: task.id,
            title: (raw.title || raw.name) ?? task.title,
            description: raw.description ?? task.description,
            progress:
              raw.progress_percentage ?? raw.progress ?? normalizedStatus ?? task.progress,
            projectName: raw.projectName || raw.project_name || task.projectName,
            dueDate: raw.due_date || raw.dueDate || task.dueDate,
            status:
              raw.progress_percentage ?? raw.progress ?? normalizedStatus ?? task.status,
          };

          return merged;
        });

        const currentTask =
          state.currentTask && state.currentTask.id === id
            ? mergedTasks.find((t) => t.id === id) ?? state.currentTask
            : state.currentTask;

        return {
          currentTask,
          tasks: mergedTasks,
        };
      });
    } catch (e) {
      console.error(`Failed to update task ${id}:`, e);
      // Optionally set an error state
      set({ error: `Failed to update task ${id}` });
    }
  },
}));

export default useTaskStore;

