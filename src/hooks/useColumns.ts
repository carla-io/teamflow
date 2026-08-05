import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createColumn,
  deleteColumn,
  getColumn,
  getColumns,
  updateColumn,
} from "../services/columnService";

/**
 * Get all columns for a project
 */
export function useColumns(projectId: string | undefined) {
  return useQuery({
    queryKey: ["columns", projectId],
    queryFn: () => getColumns(projectId!),
    enabled: !!projectId,
  });
}

/**
 * Get a single column
 */
export function useColumn(columnId: string | undefined) {
  return useQuery({
    queryKey: ["column", columnId],
    queryFn: () => getColumn(columnId!),
    enabled: !!columnId,
  });
}

/**
 * Create a column
 */
export function useCreateColumn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      title,
      position,
    }: {
      projectId: string;
      title: string;
      position: number;
    }) => createColumn(projectId, title, position),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["columns", variables.projectId],
      });
    },
  });
}

/**
 * Update a column
 */
export function useUpdateColumn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      columnId,
      projectId,
      updates,
    }: {
      columnId: string;
      projectId: string;
      updates: {
        title?: string;
        position?: number;
      };
    }) => updateColumn(columnId, updates),

    onSuccess: (column, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["columns", variables.projectId],
      });

      queryClient.invalidateQueries({
        queryKey: ["column", column.id],
      });
    },
  });
}

/**
 * Delete a column
 */
export function useDeleteColumn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      columnId,
      projectId,
    }: {
      columnId: string;
      projectId: string;
    }) => deleteColumn(columnId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["columns", variables.projectId],
      });
    },
  });
}