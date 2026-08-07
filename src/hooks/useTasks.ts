import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createTask,
  deleteTask,
  getTasksByColumn,
  getTasksByProject,
  updateTask,
} from "../services/taskService";

/**
 * Get tasks for one column
 */
export function useTasksByColumn(columnId: string | undefined) {
  return useQuery({
    queryKey: ["tasks", "column", columnId],
    queryFn: () => getTasksByColumn(columnId!),
    enabled: !!columnId,
  });
}

/**
 * Get all tasks for a project
 */
export function useTasks(projectId: string | undefined) {
  return useQuery({
    queryKey: ["tasks", "project", projectId],
    queryFn: () => getTasksByProject(projectId!),
    enabled: !!projectId,
  });
}

/**
 * Create task
 */
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,

    onSuccess: (task) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", "column", task.column_id],
      });

      queryClient.invalidateQueries({
        queryKey: ["tasks", "project"],
      });
    },
  });
}

/**
 * Update task
 */
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      updates,
    }: {
      taskId: string;
      updates: {
        title?: string;
        description?: string | null;
        priority?: string | null;
        status?: string | null;
        due_date?: string | null;
        assignee?: string | null;
        column_id?: string;
      };
    }) => updateTask(taskId, updates),

    onSuccess: (task) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });
}

/**
 * Delete task
 */
export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
    }: {
      taskId: string;
    }) => deleteTask(taskId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });
}